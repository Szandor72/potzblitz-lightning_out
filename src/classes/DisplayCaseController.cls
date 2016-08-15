public class DisplayCaseController {

    @AuraEnabled
    public static Case getCaseFromId(Id caseId) {
        if(caseId == null) {
            return new Case(Subject='no id',Description='no id',status='broken');
//            return [SELECT ID, Subject, Description, STATUS from Case LIMIT 1];
        }
        
        List<Case> cases = [ SELECT Id, Subject, Description, Status from CASE where ID = :caseId ];
        
        if(cases.size() == 0) {
            return new Case(Subject='no data.',Description='no data.',status='broken.');
//            return [SELECT ID, Subject, Description, STATUS from Case LIMIT 1];
        } else {
            return cases[0];
        }        
    }
    
    
}