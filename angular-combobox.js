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
        // $scope.model = 1;
        var options = $.extend({}, $scope.options);

        // Let's make a container for our controls
        var $combobox = $valueInput.wrap('<div class="combobox"></div>').parent();

        // Hide our value storing input
        $valueInput.hide();

        // Create a new input for display purposes
        var $displayInput = $compile('<input type="text" ng-model="selected.text">')($scope);
        $combobox.append($displayInput);

        // Add an open button
        var $open = $('<span class="open">Open</span>');
        $combobox.append($open);

        // Build our options drop down
        var $options = $compile(
          '<ul class="options">' +
            '<li class="option" ng-repeat="option in options" data-value="{{option.value}}" ng-click="selectOption(option)">{{option.text}}</li>' +
          '</ul>'
        )($scope);

        $options.hide();

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

        var setValue = function(item){
          $scope.selected = item;

          $options.hide();

          $valueInput.val(item.value);
          $valueInput.trigger('input');
        };



        $scope.selectOption = function(option){
          $options.toggle();
          $scope.model = option.value;
        };

        var setSelected = function(value){
          $scope.selected = $.grep($scope.options, function(option){
            return option.value == value;
          })[0] || {value: value, text: value};
        };

        $displayInput.on('keyup', _.debounce(function(){
          var text = $(this).val();
          var option = _.find($scope.options, {text: text});

          $timeout(function(){
            if (option) {
              $scope.model = option.value;
            } else {
              $scope.model = text;
            }
          });
        }, 250));

        // Open/close the options when the open button is clicked
        $open.on('click', function(){
          $options.toggle();
          $valueInput.focus();
        });

        // Listen for the data to change and update options
        $scope.$watchCollection('data', function(newVal, oldVal){
          if (newVal != oldVal) {
            buildOptions();
          }
        });

        $scope.$watch('model', function(newVal, oldVal){
          console.log('heard ngModel change', arguments);
          setSelected(newVal);
        });

        // var updateValue = function(){
        //   $valueInput.val($valueInput.val());
        //   // $valueInput.removeClass('ng-pristine');
        //   // $valueInput.addClass('ng-dirty');
        //   $valueInput.trigger('input');

        // };

        // $el.on('keyup', _.debounce(updateValue, 250));

        $valueInput.on('$destroy', function() {
          $open.off();
          $options.undelegate();
        });
      }
    };
  }]);

})(window.angular, window.$, window._);
