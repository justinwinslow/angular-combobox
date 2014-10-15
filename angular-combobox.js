(function(angular, $, _){
'use strict';

var template = '<div class="combobox {{ addClass }} {{ params.addClass }}">' +
  '<input type="text" ng-focus="focus" ng-model="selected.text" ng-keyup="handleKeyup($event, selected.text)" placeholder="{{ placeholder }}">' +
  '<span class="open" ng-click="toggleOptions()" ng-class="{disabled: !options.length}">Open</span>' +
  '<ul class="options" ng-class="{flip: flip}" ng-if="showOptions">' +
    '<li class="option" ng-repeat="option in options" data-value="{{option.value}}" ng-click="selectOption(option);toggleOptions();" ng-class="{hilighted: hilighted == $index}">{{option.text}}</li>' +
  '</ul>' +
'</div>';

angular.module('ngCombobox', [])
  .directive('combobox', ['$compile', '$document', '$timeout',
  function($compile, $document, $timeout) {
    return {
      scope: {
        data: '=',
        params: '=',
        model: '=ngModel'
      },
      controller: ['$scope', function($scope){
        $scope.options = [];

         // Build options list
        var buildOptions = $scope.buildOptions = function(filter){
          $scope.options = [];

          filter = filter || '';
          filter = filter.toLowerCase();

          if ($scope.data) {
            _.each($scope.data, function(item){
              // If a format function has been provided, let's use it
              item = $scope.formatOption(item);

              // If item is a string let's conform it to our options format
              if (typeof item == 'string') {
                item = {
                  value: item,
                  text: item
                };
              }

              // If the item text matches the current input text, push it to the options
              if (item.text.toLowerCase().indexOf(filter) >= 0) {
                $scope.options.push(item);
              }
            });
          }
        };

        // UI method for updating the model on selection
        $scope.selectOption = function(option){
          $scope.model = option.value;
        };

        // Set the new selected option
        var setSelected = $scope.setSelected = function(value){
          $scope.selected = _.clone(_.find($scope.data, function(item){
            return $scope.formatOption(item).value == value;
          })) || {value: value, text: value};
        };

        var filterOptions = _.debounce(function(text){
          $scope.$apply(function(){
            buildOptions(text);

            // See if there's an option that matches
            var option = _.find($scope.options, {text: text});

            if (option) {
              $scope.model = option.value;
            } else {
              $scope.model = text;
            }
          });
        }, 100);

        // Listen for the data to change and update options
        $scope.$watchCollection('data', function(newVal, oldVal){
          if (newVal != oldVal) {
            buildOptions();
            setSelected($scope.model);
          }
        });

        // Listen for the input value to change and handle any side effects
        // NOTE - because a change always fires on the model at initialization,
        // this handler will always fire one and the options will be ready when
        // the user interacts with the combobox for the first time
        $scope.$watch('selected.text', function(newVal, oldVal){
          if (newVal != oldVal) {
            filterOptions(newVal);
          }
        });

        // Listen for the model to change
        $scope.$watch('model', function(newVal, oldVal){
          if (newVal != oldVal) {
            // Update selected with new value if it's changed
            setSelected(newVal);
          }
        });
      }],
      link: function($scope, $element, $attrs, ctrl){
        var params = $.extend({}, $scope.params);

        // Compile the combobox template with our scope
        var $combobox = $compile(template)($scope);
        var $options = $combobox.find('.options');

        // Add any classes from the old element to $scope
        $scope.addClass = $attrs.class;

        // Default to hidding the options
        $scope.showOptions = false;

        // Replace input with combobox
        // Use timeout so it doesn't interrupt template rendering
        $timeout(function(){
          $element.replaceWith($combobox);
          $scope.setSelected($scope.model);
        });

        // Grab placeholder if provided
        $scope.placeholder = $element.attr('placeholder') || null;

        $scope.formatOption = params.formatOption || function(item) { return item; };

        $scope.hilighted = null;

        $scope.handleKeyup = function(event, text){
          // Show dropdown while typing
          if (!$scope.showOptions) {
            $scope.showOptions = true;
          }

          if (event.keyCode == 40) {
            // Handle down arrow
            if ($scope.hilighted === null) {
              $scope.hilighted = 0;
            } else if ($scope.hilighted < ($scope.options.length - 1)) {
              $scope.hilighted++;
            }
          } else if (event.keyCode == 38) {
            // Handle up arrow
            if ($scope.hilighted > 0) {
              $scope.hilighted--;
            }
          } else if (event.keyCode == 13) {
            // Handle enter
            $scope.selectOption($scope.options[$scope.hilighted]);
            $scope.hilighted = null;
          }
        };

        // Open/close the options when the open button is clicked
        $scope.toggleOptions = function(){
          if ($scope.showOptions) {
            $scope.showOptions = false;
            $scope.focus = false;
          } else {
            var bottomEdge = $combobox.offset().top + $combobox.height() + $options.height();

            if (bottomEdge + 24 > $(window).height()) {
              $scope.flip = true;
            } else {
              $scope.flip = false;
            }

            $scope.showOptions = true;
            $scope.focus = true;
          }
        };

        // Hide options when user clicks outside
        var hideOptions = function(event){
          var isChild = $combobox.has(event.target).length > 0;
          var isSelf = $combobox[0] == event.target;
          var isInside = isChild || isSelf;

          if (!isInside) {
            $scope.$apply(function(){
              $scope.focus = false;
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
