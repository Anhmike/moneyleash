
// PICK ACCOUNT DEFAULT DATE
moneyleashapp.controller('PickSettingsDefaultDateController', function ($scope, $state, $ionicHistory, CurrentUserService) {
    $scope.DefaultDateList = [
    { text: 'None', value: 'None' },
    { text: 'Today', value: 'Today' },
    { text: 'Last', value: 'Last' }];
    $scope.currentItem = { typedisplay: CurrentUserService.defaultdate};
    $scope.itemchanged = function (item) {
        CurrentUserService.defaultdate = item.value;
        $ionicHistory.goBack();
    };
})

// PICK ACCOUNT DEFAULT BALANCE
moneyleashapp.controller('PickSettingsDefaultBalanceController', function ($scope, $state, $ionicHistory, CurrentUserService) {
    $scope.DefaultBalanceList = [
    { text: 'Current', value: 'Current' },
    { text: 'Cleared', value: 'Cleared' },
    { text: 'Both', value: 'Both' }];
    $scope.currentItem = { typedisplay: CurrentUserService.defaultbalance};
    $scope.itemchanged = function (item) {
        CurrentUserService.defaultbalance = item.value;
        $ionicHistory.goBack();
    };
})

// ACCOUNTS/TRANSACTIONS PREFERENCES CONTROLLER
moneyleashapp.controller('AccountSettingsController', function ($scope, $ionicHistory, MembersFactory, CurrentUserService) {

    $scope.hideValidationMessage = true;
    $scope.preferences = {
        'defaultdate': '',
        'defaultbalance': ''
    }
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.hideValidationMessage = true;
        $scope.preferences.defaultdate = CurrentUserService.defaultdate;
        $scope.preferences.defaultbalance = CurrentUserService.defaultbalance;
    });

    // SAVE
    $scope.savePreferences = function () {

        // Validate form data
        if (typeof $scope.preferences.defaultdate === 'undefined' || $scope.preferences.defaultdate === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a default date behavior"
            return;
        }
        if (typeof $scope.preferences.defaultbalance === 'undefined' || $scope.preferences.defaultbalance === '') {
            $scope.hideValidationMessage = false;
            $scope.validationMessage = "Please select a default balance behavior"
            return;
        }
        //
        // Update preferences
        //
        var fbAuth = fb.getAuth();
        var usersRef = MembersFactory.ref();
        var myUser = usersRef.child(fbAuth.uid);
        var temp = {
            defaultdate: $scope.preferences.defaultdate,
            defaultbalance: $scope.preferences.defaultbalance
        }
        myUser.update(temp, function () {
            $ionicHistory.goBack();
        });
    }

})


// SECURITY CONTROLLER
moneyleashapp.controller('SecurityProfileController', function ($scope, $ionicHistory, $localStorage, MembersFactory, CurrentUserService) {

    $scope.hideSecurity = true;
    $scope.touchid = { checked: false };
    $scope.hideValidationMessage = true;

    $scope.touchidChange = function () {
        $scope.hideSecurity = !$scope.touchid.checked;
    };

    // GET SECURITY SETTINGS
    $scope.list = function () {
        if (typeof $localStorage.enableTouchID === 'undefined' || $localStorage.enableTouchID === '') {
            $scope.touchid.checked = false;
            $localStorage.email = '';
            $localStorage.password = '';
        } else {
            if ($localStorage.enableTouchID) {
                $scope.touchid.checked = $localStorage.enableTouchID;
                $scope.touchid.email = $localStorage.email;
                $scope.touchid.password = $localStorage.password;
            } else {
                $scope.touchid.checked = false;
                $localStorage.email = '';
                $localStorage.password = '';
            }
        }
        $scope.hideSecurity = !$scope.touchid.checked;
    };

    // SAVE
    $scope.savePreferences = function () {

        if ($scope.touchid.checked) {
            // Validate form data
            if (typeof $scope.touchid.email === 'undefined' || $scope.touchid.email === '') {
                $scope.hideValidationMessage = false;
                $scope.validationMessage = "Please enter the your login email address"
                return;
            }
            if (typeof $scope.touchid.password === 'undefined' || $scope.touchid.password === '') {
                $scope.hideValidationMessage = false;
                $scope.validationMessage = "Please select your login password"
                return;
            }
        }
        //
        // Update Security
        //
        if ($scope.touchid.checked) {
            $localStorage.enableTouchID = $scope.touchid.checked;
            $localStorage.email = $scope.touchid.email;
            $localStorage.password = $scope.touchid.password;
        } else {
            delete $localStorage.enableTouchID;
            delete $localStorage.email;
            delete $localStorage.password;
        }
        $ionicHistory.goBack();
    }
})

// SETTINGS CONTROLLER
moneyleashapp.controller('SettingsController', function ($scope, $state, $ionicActionSheet, $ionicHistory) {

    // Triggered on a the logOut button click
    $scope.showLogOutMenu = function () {

        // Show the action sheet
        $ionicActionSheet.show({
            destructiveText: 'Logout',
            titleText: 'Are you sure you want to logout?',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                $ionicHistory.clearCache();
                fb.unauth();
                $state.go("intro");
            }
        });
    };

    // DELETE ALL DATA
    $scope.deleteAllData = function () {

        // Show the action sheet
        $ionicActionSheet.show({
            //Here you can add some more buttons
            // buttons: [
            // { text: '<b>Share</b> This' },
            // { text: 'Move' }
            // ],
            destructiveText: 'Delete All Data',
            titleText: 'Are you sure you want to delete ALL your DATA?',
            cancelText: 'Cancel',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                //Called when one of the non-destructive buttons is clicked,
                //with the index of the button that was clicked and the button object.
                //Return true to close the action sheet, or false to keep it opened.
                return true;
            },
            destructiveButtonClicked: function () {
                //Called when the destructive button is clicked.
                //Return true to close the action sheet, or false to keep it opened.
                //if (fbAuth) {
                //    var accountPath = fireRef.child("users/" + fbAuth.uid);
                //    //var accountRef = new Firebase(accountPath);
                //    alert(accountPath);
                //    //accountRef.remove();
                //} else {
                //    alert("else part");
                //}
                //$state.go('login');
            }
        });
    };
})