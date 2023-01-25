var async = require('async'),
  traverse = require('traverse'),
  printDebug = require('debug')('json-validator'),
  validator = require('validator'),
  utils = require('gammautils'),
  forEachOwnProperty = utils.object.forEachOwnProperty,
  deepSet = utils.object.deepSet,
  deepMerge = utils.object.deepMerge,
  deepDelete = utils.object.deepDelete,
  unflatten = utils.object.unflatten,
  constants = require('./constants.cjs'),
  matchers = require('./matchers.cjs').matchers,
  customTransforms = require('./matchers.cjs').customTransforms,
  pushMessage = require('./matchers.cjs').pushMessage;

validator.extend('specificLengths', function (string) {
  var lengths = Array.prototype.slice.call(arguments, 1);
  return lengths.indexOf(string.length) > -1;
});

validator.extend('toNull', function (string) {
  if (!string) {
    return null;
  }

  return string;
});

validator.extend('toUpperCase', function (string) {
  return string.toUpperCase();
});

validator.extend('toLowerCase', function (string) {
  return string.toLowerCase();
});

module.exports.NULL = constants.NULL;

module.exports.extend = function (name, fn) {
  validator.extend(name, fn);
};

module.exports.resetMessages = function () {
  require('./matchers').resetMessages();
};

module.exports.setMessages = function (messages) {
  require('./matchers').setMessages(messages);
};

module.exports.setMessage = function (validator, message) {
  require('./matchers').validationMessages[validator] = message;
};

module.exports.setCustomTransforms = function (transforms) {
  Object.keys(transforms).forEach(function (customTransformName) {
    if (require('./matchers').customTransforms[customTransformName]) {
      throw new Error(
        'Transform  "' + customTransformName + '" already exists'
      );
    }

    require('./matchers').customTransforms[customTransformName] =
      transforms[customTransformName];
  });
};

module.exports.setCustomValidators = function (validators) {
  Object.keys(validators).forEach(function (customValidatorName) {
    if (validator[customValidatorName]) {
      throw new Error(
        'Validator  "' + customValidatorName + '" already exists'
      );
    }

    validator.extend(customValidatorName, validators[customValidatorName]);
  });
};

module.exports.validate = function (
  object,
  schema,
  optionals,
  debug,
  callback
) {
  if (typeof object === 'string') {
    object = JSON.parse(object);
  }

  if (typeof optionals === 'undefined') {
    optionals = [];
  }

  if (typeof optionals === 'boolean') {
    debug = optionals;
    optionals = [];
  }

  if (typeof optionals === 'function') {
    debug = false;
    callback = optionals;
    optionals = [];
  }

  if (typeof debug === 'undefined') {
    debug = false;
  }

  if (typeof debug === 'function') {
    callback = debug;
    debug = false;
  }

  var choiceGroups = {
    requireds: [], // List of choice groups that are required
    sets: {}, // List of choice groups that were set
  }; //should check sets x requireds and if any required was not set than add an error message

  return validate(
    object,
    schema,
    '',
    [],
    optionals,
    choiceGroups,
    [],
    debug,
    callback
  );
};

function validate(
  object,
  _schema,
  path,
  messages,
  optionals,
  choiceGroups,
  escapePrefixes,
  debug,
  callback
) {
  if (!Array.isArray(_schema)) {
    _schema = [_schema];
  }

  var messageObject = {},
    schema = _schema.reduce(function (previous, current) {
      return deepMerge(previous, current);
    }, {}),
    asyncValidations = [],
    asyncTransformations = [];

  object = traverse(object);

  traverse(schema).forEach(function (node) {
    if (!Array.isArray(node)) {
      return;
    }

    var array = object.get(this.path);

    if (typeof array === 'undefined') {
      return;
    }

    this.update(fixArray(node, array, this.path));
  });

  function fixArray(array, actualArray, path) {
    var times = actualArray.length;

    if (times === 0) {
      return [];
    }

    var object = array[0],
      isFunction = typeof object === 'function';

    if (isFunction) {
      array = [];
    }

    for (var i = 0; i < times - (isFunction ? 0 : 1); i++) {
      if (isFunction) {
        array.push(object(actualArray[i]));
      } else {
        array.push(object);
      }
    }

    return array;
  }

  traverse(schema).forEach(function (node) {
    var matchersThatShouldNotContinue = ['enum', 'transform', 'validate'];

    if (
      this.parent &&
      matchersThatShouldNotContinue.indexOf(this.parent.key) > -1
    ) {
      //if parent is enum do not continue to its parameters
      return;
    }

    if (this.parent && validator[this.parent.key]) {
      //if parent is a validator method, do not continue to its parameters
      return;
    }

    var shouldContinue =
      Array.isArray(node) &&
      (this.key === 'enum' ||
        this.key === 'transform' ||
        this.key === 'validate' ||
        validator[this.key]);

    if (typeof node === 'object' && !shouldContinue) {
      return;
    }

    var objectPath = traverse.clone(this.path);

    objectPath.pop();

    var objectValue = object.get(objectPath);

    if (
      this.parent &&
      'skip' in this.parent.node &&
      this.parent.node['skip'] === true
    ) {
      return;
    }

    var _objectPath = objectPath.join('.'),
      shouldEscape = false;

    shouldEscape = escapePrefixes.some(function (escapePrefix) {
      return _objectPath.indexOf(escapePrefix) === 0;
    });

    if (shouldEscape) {
      return;
    }

    if (
      this.parent && //tem um pai e
      'required' in this.parent.node && //o pai tem "required" e
      this.parent.node['required'] === false && //o required do pai é falso e
      (objectValue === null || typeof objectValue === 'undefined')
    ) {
      //o objeto corrente não foi fornecido

      if ('default' in this.parent.node) {
        // Tem valor default, então continua
      } else {
        escapePrefixes.push(objectPath.join('.') + '.');

        if (debug) {
          console.log('Not required and null or undefined');
        }

        return; //nem continua
      }
    }

    //didn't find, parent is listed as optional and parent also was not found
    if (
      !objectValue &&
      this.parent &&
      this.parent.parent &&
      find(optionals, this.parent.parent.path.join('.')) &&
      !object.get(this.parent.parent.path)
    ) {
      return;
    }

    var matcherMethod = this.path.pop();

    if (matcherMethod.indexOf('prevent') === 0) {
      matcherMethod = 'prevent';
    }

    if (matcherMethod === 'requiredChoiceGroup') {
      return;
    }

    if (matcherMethod === 'choiceGroup') {
      var choiceGroupPath = objectPath.slice(0, -1).join('.') || 'root';

      if (
        this.parent &&
        this.parent.node &&
        this.parent.node.requiredChoiceGroup === true
      ) {
        choiceGroups.requireds.push(choiceGroupPath + '|' + node);
      }

      if (
        choiceGroups.sets[choiceGroupPath] &&
        choiceGroups.sets[choiceGroupPath][node] &&
        typeof objectValue !== 'undefined'
      ) {
        // O valor do grupo já havia sido informado anteriormente
        return pushMessage(
          messages,
          matcherMethod,
          objectValue,
          objectPath.join('.'),
          params,
          messageObject,
          require('./matchers').validationMessages[matcherMethod]
        );
      }

      if (typeof objectValue !== 'undefined') {
        if (!choiceGroups.sets[choiceGroupPath]) {
          choiceGroups.sets[choiceGroupPath] = {};
        }

        choiceGroups.sets[choiceGroupPath][node] = true;
      }
    }

    if (matchers[matcherMethod] || customTransforms[matcherMethod]) {
      if (matcherMethod === 'transform' && Array.isArray(node)) {
        //we have multiple functions so we wrap them into a single function
        //with underscore's compose
        function compose(args) {
          var start = args.length - 1;

          return function () {
            var i = start;
            var result = args[start].apply(this, arguments);
            while (i--) result = args[i].call(this, result);

            return result;
          };
        }

        node = compose(node.reverse());
      }

      var that = this;
      objectClone = deepMerge({}, object.value);

      if (
        this.parent &&
        this.parent.parent &&
        this.parent.parent.parent &&
        Array.isArray(this.parent.parent.parent.node)
      ) {
        objectClone = deepMerge({}, object.get(this.parent.parent.path));
      }

      function preventNext() {
        that.parent.node['skip'] = true;
      }

      var match = (
        matchers[matcherMethod] || customTransforms[matcherMethod]
      ).call(
        objectClone,
        node,
        objectValue,
        objectPath.join('.'),
        messages,
        optionals,
        messageObject,
        preventNext
      );

      if (matcherMethod === 'unset' && match === true) {
        //unset returns true or false;
        // true - remove
        // false - do not remove
        deepDelete(object.value, objectPath);
      }

      if (
        ['transform', 'default'].indexOf(matcherMethod) > -1 ||
        customTransforms[matcherMethod]
      ) {
        //Aqui eu posso salvar o objectPath junto com o valor transformado,
        //e depois só aplicar se não houverem mensagens.
        //
        //Neste caso as transformações são aplicadas independente de estar valido ou não
        //o que pode não ser desejado.

        object.set(objectPath, match);
      } else if (['asyncValidate'].indexOf(matcherMethod) > -1) {
        asyncValidations.push(match);
      } else if (['asyncTransform'].indexOf(matcherMethod) > -1) {
        asyncTransformations.push(match);
      }
    } else if (validator[matcherMethod]) {
      var params = [objectValue],
        shouldInvert = false;

      if (Array.isArray(node)) {
        params = params.concat(node);
      } else if (typeof node === 'boolean') {
        shouldInvert = !node;
      }

      params = params.map(function (param) {
        if (typeof param === 'function') {
          param = param.apply(deepMerge({}, object.value));
        }

        return param;
      });

      var result = validator[matcherMethod].apply(null, params);

      if (typeof result === 'boolean' && matcherMethod !== 'toBoolean') {
        if (shouldInvert) {
          result = !result;
        }

        if (!result) {
          if (require('./matchers').validationMessages[matcherMethod]) {
            pushMessage(
              messages,
              matcherMethod,
              objectValue,
              objectPath.join('.'),
              params,
              messageObject,
              require('./matchers').validationMessages[matcherMethod]
            );
          } else {
            pushMessage(
              messages,
              matcherMethod + ':validatorjs',
              objectValue,
              objectPath.join('.'),
              params,
              messageObject
            );
          }
        }
      } else {
        object.set(objectPath, result);
      }
    } else {
      printDebug(
        "Warning: validator '" + matcherMethod + "' was not found. Skipping!"
      );
    }

    if (debug) {
      console.log(
        this.path.join('.') +
          '.' +
          matcherMethod +
          ' === ' +
          node +
          ' | ' +
          objectValue +
          ' >>> ' +
          match
      );
    }
  });

  var choiceGroupMessagesAdded = {};
  choiceGroups.requireds.forEach(function (requiredGroup) {
    var _requiredGroup = requiredGroup.split('|'),
      groupPath = _requiredGroup[0],
      groupId = _requiredGroup[1];

    if (
      !choiceGroups.sets[groupPath] ||
      !choiceGroups.sets[groupPath][groupId]
    ) {
      if (!choiceGroupMessagesAdded[requiredGroup]) {
        choiceGroupMessagesAdded[requiredGroup] = true;
        pushMessage(
          messages,
          'requiredChoiceGroup',
          groupId,
          groupPath,
          [true],
          messageObject
        );
      }
    }
  });

  if (debug) {
    console.log(messages);
  }

  if (callback) {
    function generateMessageTree(messageObject) {
      var messageTree = unflatten(messageObject);

      return traverse(messageTree).forEach(function (node) {
        if (typeof node !== 'object') {
          return;
        }

        if (Array.isArray(node)) {
          var children = node.length,
            traversed = 0;

          this.post(function () {
            traversed++;

            if (children === traversed) {
              var newNode = node.filter(function (elemento) {
                return elemento !== null && typeof elemento !== 'undefined';
              });

              if (newNode.length === 0) {
                this.remove();
              } else {
                this.update(newNode);
              }
            }
          });
        }

        var nodesToOutput = Object.keys(node).filter(function (key) {
          return key.indexOf('__') === 0;
        });

        if (nodesToOutput.length > 0) {
          var numberOfProperties = 0,
            numberOfArrays = 0,
            numberOfNonArrays = 0;

          forEachOwnProperty(node, function (propertyName, object) {
            numberOfProperties++;

            if (Array.isArray(object) && typeof object[0] === 'object') {
              numberOfArrays++;
            } else {
              numberOfNonArrays++;
            }
          });

          if (numberOfProperties - numberOfArrays === nodesToOutput.length) {
            nodesToOutput.forEach(function (key) {
              delete node[key];
            });

            if (this.notRoot && JSON.stringify(node) === '{}') {
              if (this.parent && Array.isArray(this.parent.node)) {
                this.update(null);

                if (this.parent.node.length === 0) {
                  this.parent.remove();
                }
              } else {
                this.remove();
              }
            }
          }
        }
      });
    }

    async.parallel(asyncValidations, function (err, asyncMessages) {
      if (err) {
        return callback(err);
      }

      var messageTree = generateMessageTree(messageObject),
        isValid = JSON.stringify(messageTree) === '{}';

      async.parallel(asyncTransformations, function (err, newValues) {
        if (err) {
          return callback(err);
        }

        newValues.forEach(function (transform) {
          deepSet(object.value, transform.path, transform.newValue);
        });

        callback(null, messageTree, isValid, messages);
      });
    });
  }

  return messages;
}

function find(array, term) {
  var found = false;

  array.forEach(function (element) {
    if (term.indexOf(element) !== -1) {
      found = true;
    }
  });

  return found;
}
