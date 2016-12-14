import './style.less';

var directive =
    angular.module('accordion-view',[])
        .directive('accordionView', function () {
            return {
                restrict : 'AE',
                replace : true,
                template :require('./template.html'),
                scope: {
                    domId: '@'
                },
                controller : ['$scope', '$element','CoachPlus',function ($scope, $element, CoachPlus) {
                    angular.extend($scope, new CoachPlus($scope, $element, $scope.domId));
                    
                    $scope.costTable = $scope.bindOption('table', true);


                }]
            }
        });

export default directive.name;