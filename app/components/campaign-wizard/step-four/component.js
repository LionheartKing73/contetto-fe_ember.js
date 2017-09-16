import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        saveCampaign() {
            this.get("saveCampaign")();
        },
        nextStep() {
            this.get("nextStep")();
        },
        previousStep() {
            this.get("previousStep")();
        }
    }
});
