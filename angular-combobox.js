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
  .directive('combobox', ['$parse', '$animate', '$compile', '$document',
  function($parse, $animate, $compile, $document) {
    return {
      scope: {
        data: '=',
        params: '=',
        model: '=ngModel'
      },
      link: function($scope, $element, $attrs, ctrl){
        var params = $.extend({}, $scope.params);

        $scope.data = $scope.data || [];

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
            $scope.options.push(params.formatOption ? params.formatOption(item) : item);
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

        // Hide options when user clicks outside
        var hideOptions = function(event){
          var isChild = $combobox.has(event.target).length > 0;
          var isSelf = $combobox[0] == event.target;
          var isInside = isChild || isSelf;

          if (!isInside) {
            $scope.$apply(function(){
              $scope.showOptions = false;
            });
          }
        };

        $document.on('click', hideOptions);

        // Clean up
        $scope.$on('$destroy', function(){
          $document.off('click', hideOptions);
        });
      }
    };
  }]);

})(window.angular, window.$, window._);
