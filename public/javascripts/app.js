function forceInit() {
    force.init(config);
};

function forceLogin(key) {
    forceInit();
    force.login(function(success) {
        var oauth = force.getOauth();
        setupLightning();
    });
}

var _lightningReady = false;

function setupLightning(callback) {
    var appName = config.loApp;
    var oauth = force.getOauth();
    if (!oauth) {
        alert("Please login to Salesforce.com first!");
        return;
    }

    if (_lightningReady) {
        if (typeof callback === "function") {
            callback();
        }
    } else {
        // Transform the URL for Lightning
        var url = oauth.instanceUrl.replace("my.salesforce", "lightning.force");

        $Lightning.use(appName,
            function() {
                _lightningReady = true;
                document.getElementById("getComponentButton").style.display = "";
                queryCases();
                document.getElementById("forceLogin").style.display = "none";
                if (typeof callback === "function") {
                    callback();
                }
            }, url, oauth.access_token);
    }
}
var myComponent;

function createComponent(type, subjectId) {
    setupLightning(function() {
        console.log('+++createComponent ');
        var myComponent = $Lightning.createComponent("c:DisplayCase", {
            type: type,
            subjectId: subjectId
        }, "componentDiv");
        document.getElementById("caseXferButton").style.display = "";
    });
}

var howdyHeroku = function(x) {
    alert('heroku js received msg=> ' + x)
};

var putId = function(id) {
    var appEvent = $A.get("e.c:DisplayCaseEvt");
    appEvent.setParams({
        "myVal": id
    });
    appEvent.fire();
};

function queryCases() {
    force.query('SELECT Id FROM Case LIMIT 5', function(response) {
        var html = '';
        for (var i = 0; i < response.records.length; i++) {
            var tmpId = response.records[i].Id
            html += '<li><a href="javascript:putId(\''+ tmpId + '\')">' + tmpId + '</a></li>';
        }
        document.getElementById('caseList').innerHTML = html;
    });
}
