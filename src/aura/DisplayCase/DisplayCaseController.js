({
    getCaseFromId_CS: function(component, event, helper) {
        console.log('client side controller')
//        var recordId = component.find("CaseId").get("v.value")
        var recordId = component.get("v.recordId")
        console.log('case record Id..: ' + recordId)
        var action = component.get("c.getCaseFromId"); //server side controller
        action.setParams({
            "caseId": component.get("v.recordId")
        });

        action.setCallback(this, function(response) {
            console.log('callback')
            console.log(response.getReturnValue().Id)
            var allTheStuffs = [];
            //allTheStuffs.push(response.getReturnValue())
            //alert(JSON.stringify(allTheStuffs))
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(JSON.stringify(response.getReturnValue()))
                component.set("v.record", response.getReturnValue())
            }
        });
        $A.enqueueAction(action);
    },


    howdy: function() {
        console.log('cs controller calling js served by Heroku')
        howdyHeroku('msg from component');
    },

    handleApplicationEventFired: function(cmp, event) {
        var Id = event.getParam("myVal");
        cmp.set("v.recordId", Id);
        console.log('handle event ' + Id)
        var action = cmp.get("c.getCaseFromId_CS");
        $A.run(function() {
            $A.enqueueAction(action);
        });
    },

    fireApplicationEvent: function(cmp, event) {
        var appEvent = $A.get("e.c:DisplayCaseEvt");
        console.log(appEvent)
        appEvent.setParams({
            "myVal": 'valfromMySelfInTheController'
        });
        appEvent.fire();
    }

})