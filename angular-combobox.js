(function(angular, $, _){
'use strict';

angular.module('ngCombobox', [])
  .directive('combobox', ['$parse', '$animate', function($parse, $animate) {
    return {
      scope: {
        data: '=',
        options: '='
      },
      link: function($scope, $element, $attr, ctrl){
        var options = $.extend({}, $scope.options);
        // Let's make a container for our controls
        var $combobox = $element.wrap('<div class="combobox"></div>').parent();

        console.log($element, $combobox);
        // Add an open button
        var $open = $('<span class="open">Open</span>');
        $combobox.append($open);

        var $options = $('<ul />');

        $options.hide();

        // Build options list
        $.each($scope.data, function(index, item){
          item = options.formatOption ? options.formatOption(item) : item;

          $options.append('<li data-value="' + item.value + '">' + item.text + '</li>');
        });

        $options.delegate('li', 'click', function(event){
          var selectedValue = $(this).attr('data-value');
          $element.val(selectedValue);
          $element.trigger('input');
        });

        $open.on('click', function(){
          $options.toggle();
        });

        $combobox.append($options);


        // var updateValue = function(){
        //   $element.val($input.val());
        //   // $element.removeClass('ng-pristine');
        //   // $element.addClass('ng-dirty');
        //   $element.trigger('input');

        // };

        // $el.on('keyup', _.debounce(updateValue, 250));
      }
    };
  }]);

})(window.angular, window.$, window._);
