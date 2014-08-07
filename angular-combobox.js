(function(angular, $, _){
'use strict';

angular.module('ngCombobox', [])
  .directive('combobox', ['$parse', '$animate', '$compile', '$timeout', function($parse, $animate, $compile, $timeout) {
    return {
      scope: {
        data: '=',
        options: '=',
        model: '=ngModel'
      },
      link: function($scope, $valueInput, $attrs, ctrl){
        var options = $.extend({}, $scope.options);

        // Let's make a container for our controls
        var $combobox = $valueInput.wrap('<div class="combobox"></div>').parent();

        // Hide our value storing input
        $valueInput.hide();

        // Create a new input for display purposes
        var $displayInput = $compile('<input type="text" ng-model="selected.text">')($scope);
        $combobox.append($displayInput);

        // Add an open button
        var $open = $compile('<span class="open" ng-click="toggleOptions()">Open</span>')($scope);
        $combobox.append($open);

        // Build our options drop down
        var $options = $compile(
          '<ul class="options" ng-show="showOptions">' +
            '<li class="option" ng-repeat="option in options" data-value="{{option.value}}" ng-click="selectOption(option)">{{option.text}}</li>' +
          '</ul>'
        )($scope);

        $scope.showOptions = false;

        // Append the options item to the dom
        $combobox.append($options);

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
          $scope.selected = $.grep($scope.options, function(option){
            return option.value == value;
          })[0] || {value: value, text: value};
        };

        $displayInput.on('keyup', _.debounce(function(){
          // Store the input "search" text
          var text = $(this).val();
          // See if there's an option that matches
          var option = _.find($scope.options, {text: text});

          // Set the model
          // NOTE - This is wrapped in a $timeout to make it part of a digest
          // cycle so the view updates properly
          $timeout(function(){
            if (option) {
              $scope.model = option.value;
            } else {
              $scope.model = text;
            }
          });
        }, 250));

        // Open/close the options when the open button is clicked
        $scope.toggleOptions = function(){
          $scope.showOptions = !$scope.showOptions;
          $displayInput.focus();
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
