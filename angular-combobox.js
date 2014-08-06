(function(angular, $, _){
'use strict';

angular.module('ngCombobox', [])
  .directive('combobox', ['$parse', '$animate', function($parse, $animate) {
    return {
      scope: {
        data: '=',
        options: '='
      },
      link: function($scope, $input, $attrs, ctrl){
        var options = $.extend({}, $scope.options);
        // Let's make a container for our controls
        var $combobox = $input.wrap('<div class="combobox"></div>').parent();

        console.log($input, $combobox);
        // Add an open button
        var $open = $('<span class="open">Open</span>');
        $combobox.append($open);

        var $options = $('<ul class="options" />');

        $options.hide();

        // Build options list
        var buildOptions = function(){
          $options.empty();

          $.each($scope.data, function(index, item){
            item = options.formatOption ? options.formatOption(item) : item;

            $options.append('<li class="option" data-value="' + item.value + '">' + item.text + '</li>');
          });
        };

        // Build initial options
        buildOptions();

        // Append the options item to the dom
        $combobox.append($options);

        // Handle clicks on options
        $options.delegate('li', 'click', function(event){
          var selectedValue = $(this).attr('data-value');
          $input.val(selectedValue);
          $input.trigger('input');
          $options.toggle();
        });

        // Open/close the options when the open button is clicked
        $open.on('click', function(){
          $options.toggle();
          $input.focus();
        });

        // Listen for the data to change and update options
        $scope.$watchCollection('data', function(newVal, oldVal){
          console.log('data changed', newVal, newVal == oldVal);
          if (newVal != oldVal) {
            buildOptions();
          }
        });

        console.log('data', $scope.data);

        // var updateValue = function(){
        //   $input.val($input.val());
        //   // $input.removeClass('ng-pristine');
        //   // $input.addClass('ng-dirty');
        //   $input.trigger('input');

        // };

        // $el.on('keyup', _.debounce(updateValue, 250));

        $input.on('$destroy', function() {
          $open.off();
          $options.undelegate();
        });
      }
    };
  }]);

})(window.angular, window.$, window._);
