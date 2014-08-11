(function(angular, $, _){
'use strict';

var template = '<div class="combobox">' +
  '<input type="text" ng-model="selected.text" ng-keyup="handleKeyup(selected.text)">' +
  '<span class="open" ng-click="toggleOptions()" ng-class="{disabled: !options.length}">Open</span>' +
  '<ul class="options" ng-show="showOptions && options.length">' +
    '<li class="option" ng-repeat="option in options" data-value="{{option.value}}" ng-click="selectOption(option)">{{option.text}}</li>' +
  '</ul>' +
'</div>{{options.length}}';

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
        var buildOptions = function(filter){
          $scope.options = [];

          filter = filter || '';

          $.each($scope.data, function(index, item){
            var option = params.formatOption ? params.formatOption(item) : item;
            if (option.text.indexOf(filter) >= 0) {
              $scope.options.push(option);
            }
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

        $scope.handleKeyup = _.debounce(function(text){
          $scope.$apply(function(){
            buildOptions(text);
            // Show dropdown while typing
            if (!$scope.showOptions) {
              $scope.showOptions = true;
            }

            // See if there's an option that matches
            var option = _.find($scope.options, {text: text});

            if (option) {
              $scope.model = option.value;
            } else {
              $scope.model = text;
            }
          });
        }, 200);

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
