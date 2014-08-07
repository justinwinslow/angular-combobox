(function(angular, $, _){
'use strict';

var template = '<div class="combobox">' +
  '<input type="text" ng-model="selected.text" ng-keyup="handleKeyup(selected.text)">' +
  '<span class="open" ng-click="toggleOptions()">Open</span>' +
  '<ul class="options" ng-show="showOptions">' +
    '<li class="option" ng-repeat="option in options" data-value="{{option.value}}" ng-click="selectOption(option)">{{option.text}}</li>' +
  '</ul>' +
'</div>';

angular.module('ngCombobox', [])
  .directive('combobox', ['$parse', '$animate', '$compile', '$timeout', function($parse, $animate, $compile, $timeout) {
    return {
      scope: {
        data: '=',
        options: '=',
        model: '=ngModel'
      },
      link: function($scope, $element, $attrs, ctrl){
        var options = $.extend({}, $scope.options);

        // Compile the combobox template with our scope
        var $combobox = $compile(template)($scope);

        // Replace input with combobox
        $element.replaceWith($combobox);

        $scope.showOptions = false;

        $scope.options = [];

        // Build options list
        var buildOptions = function(){
          $scope.options = [];

          $.each($scope.data, function(index, item){
            $scope.options.push(options.formatOption ? options.formatOption(item) : item);
          });
        };

        // Build initial options
        buildOptions();

        // UI method for updating the model on selection
        $scope.selectOption = function(option){
          $scope.showOptions = false;
          $scope.model = option.value;
        };

        // Set the new selected option
        var setSelected = function(value){
          $scope.selected = _.clone(_.find($scope.options, {value: value})) || {value: value, text: value};
        };

        $scope.handleKeyup = function(text){
          // See if there's an option that matches
          var option = _.find($scope.options, {text: text});

          if (option) {
            $scope.model = option.value;
          } else {
            $scope.model = text;
          }
        };

        // Open/close the options when the open button is clicked
        $scope.toggleOptions = function(){
          $scope.showOptions = !$scope.showOptions;
        };

        // Listen for the data to change and update options
        $scope.$watchCollection('data', function(newVal, oldVal){
          if (newVal != oldVal) {
            buildOptions();
          }
        });

        // Listen for the model to change
        $scope.$watch('model', function(newVal, oldVal){
          // Update selected with new value if it's changed
          setSelected(newVal);
        });

        // Clean up
        $scope.$on('$destroy', function(){
          $displayInput.off();
        });
      }
    };
  }]);

})(window.angular, window.$, window._);
