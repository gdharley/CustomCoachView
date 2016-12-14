import './style.less';

var directive =
    angular.module('table-calculation',[])
        .directive('tableCalculation', function () {
            return {
                restrict : 'AE',
                replace : true,
                template :require('./template.html'),
                scope: {
                    domId: '@'
                },
                controller : ['$scope', '$element','CoachPlus',function ($scope, $element, CoachPlus) {
                    angular.extend($scope, new CoachPlus($scope, $element, $scope.domId));

                    $scope.doRand = function () {
                        for(var x = 0; x < $scope.costTable.length; x++) {
                            $scope.costTable[x].count = Math.floor(Math.random()*100);
                        }
                    }

                    $scope.costTable = $scope.bindOption('table', true);
                    $scope.medicineCostReference = $scope.bindOption('medicineCost');
                    $scope.validateMedicinesService = $scope.bindService('validateMedicines');

                    $scope.$watch('costTable', function () {
                        var total = 0;

                        var medicinesArray = [];

                        for(var x = 0; x < $scope.costTable.length; x++) {
                            if($scope.costTable[x].name != '') {
                                $scope.medicineCostReference.forEach(function (a) {
                                    if(a.name == $scope.costTable[x].name) {
                                        $scope.costTable[x].cost = a.price;
                                    }
                                });

                                medicinesArray.push($scope.costTable[x].name);
                            }
                            $scope.costTable[x].total =
                                $scope.costTable[x].cost
                                * $scope.costTable[x].count;

                            total += $scope.costTable[x].total;
                        }

                        $scope.setOption('total', total);

                        $scope.validateMedicinesService({
                                medicines: medicinesArray
                            })
                            .then(function (res) {
                                $scope.error = res.error;
                            })

                    }, true);



                }]
            }
        });

export default directive.name;