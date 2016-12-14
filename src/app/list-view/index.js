import './style.less';

import '../../../node_modules/angular-ui-grid/ui-grid.min.js';
import '../../../node_modules/angular-ui-grid/ui-grid.css';

var directive =
    angular.module('list-view',['ui.grid','ui.grid.edit', 'ui.grid.cellNav','ui.grid.moveColumns'])
        .directive('listView', function () {
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