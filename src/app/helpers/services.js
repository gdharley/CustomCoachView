/*
WARNING
This helper code is not supported. Use at your own risk.
If you use it, make sure you understand what it does and it's restrictions.
 */

var serv = angular.module('coach-plus',[])
    .controller('SimpleBPMShim', ['$scope','$element',function ($scope,$element) {

        //remove all style added by the responsive coaches
        $scope.show = true;
        $scope.style = function () {
            return {};
        }
        $scope.css = function () {
            return {};
        }
        $element.attr('class','');

        var oldCLass = angular.element($element[0].view.context.element).attr('class').split(' ');
        var newClass = oldCLass.reduce(function (total, current) {return total + (current.indexOf('BPM_Resp_')==0 ? '' : current)},'');
        angular.element($element[0].view.context.element).attr('class', newClass);

    }])
.factory("CoachPlus",['Coach','$q',
    function (Coach, $q) {
        var CoachPlus = function ($scope, $element, domId) {

            $element[0].view = window.com_ibm_bpm_global.coachView.byDomId(domId);
            angular.extend($scope, new Coach($scope, $element));
            var scope = $scope,
                _this = this;

            scope.cp = {
                options: {}
            };

            scope.bindings = {};

            /*
            WARNING: deep watching OR two way binding can add a significant amount of overhead ... TEST on expected data volume and browser type to make sure performance is acceptable

            @optionName the name of the option to bind
            @twoWay if the changes from angular should be persisted to CoachViews
             */
            this.bindOption = function (optionName, twoWay) {


                scope.deepWatchOption(optionName, "value", function (a) {

                    var option = scope.getOption(optionName);


                    //UPDATE the array
                    if(scope.cp.options[optionName] == undefined) {
                        //initialize array and insert the initial set of items

                        scope.cp.options[optionName] = [];
                        for(var x =0; x < option.items.length; x++) {
                            scope.cp.options[optionName].push(option.items[x]);
                        }
                    } else if (a != undefined) {
                        //as items are added/removed update the in-scope list

                        if(a.newVal != undefined) {
                            //adding item to the list
                            scope.watchIgnore = true;
                            scope.cp.options[optionName].splice(a.insertedInto, 0, a.newVal);
                        } else {
                            //removing items from the list
                            scope.watchIgnore = true;
                            scope.cp.options[optionName].splice(a.removedFrom, 1);
                        }
                    }


                    //REMOVE existing listeners on array items
                    if(scope.bindings[optionName] != null) {
                        for(var x = 0; x < scope.bindings[optionName].length; x++) {
                            scope.bindings[optionName][x].unbind();
                        }
                        scope.bindings[optionName] = null;
                    }


                    //ADD new listeners on array items
                    for(var x =0; x < option.length(); x++) {
                        var item = option.get(x);
                        scope.bindings[optionName] = [];

                        scope.bindings[optionName].push(
                            item.bindAll((function (a) {
                                var row = this.row;
                                scope.$evalAsync(function(){
                                    scope.watchIgnore = true;
                                    scope.cp.options[optionName][row][a.property] = a.newVal;
                                });
                            }).bind({row:x}))
                        );
                    }
                })


                if(twoWay) {
                    //if two way binding is desired, watch the scope and push changes in to coach views
                    scope.$watch('cp.options.'+optionName, function (newItem, oldItem) {

                        if(scope.watchIgnore) {
                            scope.watchIgnore = false;
                            return;
                        }

                        if(newItem.length == undefined) {
                            console.log(scope.getOption(optionName));
                            return;
                        }

                        var resolved = false;
                        var option = scope.getOption(optionName);

                        for(var x = 0; x < newItem.length; x++) {
                            for(var y = 0; y < oldItem.length; y++) {
                                if(x == y && !isEqualProperties(newItem[x], oldItem[y])) {

                                    if(newItem.length > oldItem.length) {
                                        console.log('ADDED', newItem[x],oldItem[y],x)
                                        //TODO: Implement
                                    } else if (newItem.length < oldItem.length) {
                                        console.log('removed', newItem[x],x);
                                        //TODO: Implement
                                    } else if(newItem.length == oldItem.length){
                                        var itemObj = option.get(x);
                                        updateProperties(itemObj, newItem[x]);
                                    }
                                    resolved = true;
                                }
                            }
                        }

                        if(!resolved && newItem.length < oldItem.length) {
                            //item was removed from the bottom
                            console.log('remove item - bottom');
                            //TODO: Implement

                            resolved = true;

                        } else if(!resolved && newItem.length > oldItem.length) {
                            //item was added to the bottom
                            console.log('new item - bottom');
                            //TODO: Implement

                            resolved = true;

                        }

                        if(resolved) {
                            scope.setOption(optionName, option)

                        }


                    }, true);
                }

                return scope.cp.options[optionName];
                
            }

            this.bindService = function (serviceName) {
                return function (input) {
                    var deferred = $q.defer();

                    scope.context.options[serviceName]({
                        params : JSON.stringify(input),
                        load : function (data) {
                            deferred.resolve(data);
                        },
                        error : function (data) {

                        }
                    });

                    return deferred.promise;
                }
            }

        }

        var ignoreProps = [];

        function isEqualProperties(obj1, obj2) {
            for(var x in obj1) {
                for(var y in obj2) {
                    if(x==y && obj1[x] != obj2[y])
                        return false;
                }
            }
            return true;
        }

        function updateProperties(to, from) {
            for(var y in from) {
                if(ignoreProps.indexOf(y) == -1)
                    to[y] = from[y];
            }
        }

        return CoachPlus;
    }
]);

export default serv.name;