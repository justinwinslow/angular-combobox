angular-combobox
================

Select and raw text entry combo input for angular.

## Example

### HTML

```html

<input type="text" ng-model="someModel" data="someArrayOfOptions" params="params">
```

### data

The data attribute should be set to the array of options that are possible for the input. This can be an array of strings or objects. The option format used by angular-combobox is `{value: 'value', text: 'text'}` but it is not required that your data conform to this schema. You can use the formatOption parameter to tell the directive how it should interpret your data.

Note: An array of strings will be converted automatically but you can still ise the format option param if you need to modify the data in some way.

### params

* `formatOption` - function to conform your data to the format used by angular-combobox. Example:
```javascript
// If your data schema looks like: {id: 0, name: 'Model Name'}
$scope.params = {
  formatOption: function(option){
    return {
      value: option.id,
      text: option.name
    };
  }
}
```

## TODO

* Bower registry
