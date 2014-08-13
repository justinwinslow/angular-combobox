angular-combobox
================

Select and raw text entry combo input for angular.

## Example

```html

<input type="text" ng-model="someModel" data="someArrayOfOptions" params="params">
```

### data

The data attribute should be set to the array of options that are possible for the input. This can be an array of strings or objects. The option format used by angular-combobox is `{value: 'value', text: 'text'}` but it is not required that your data conform to this schema. You can use the formatOption parameter to tell the directive how it should interpret your data.

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

// If your data is just an array of strings
$scope.params = {
  formatOption: function(option){
    return {
      value: option,
      text: option
    };
  }
}
```

## TODO

* Selectively position options dropdown up or down depending on input position on screen
* Better docs
* Bower registry
* Make it work with select boxes? (Started on this, decided it wasn't a good idea)
