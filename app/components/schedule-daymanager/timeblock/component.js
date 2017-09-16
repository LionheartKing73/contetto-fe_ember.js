import Ember from 'ember';
const {
    Component,
    get,
    set,
    inject: {
        service
    }
} = Ember;
export default Ember.Component.extend({
    options: Ember.computed(function() {
        let myOptions = {
            timeFormat: 'h:mm p',
            interval: 30,
            minTime: '12:00am',
            maxTime: '11:30pm',
            startTime: '12:00AM',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        };
        myOptions.defaultTime = this.get("item.hour") + ':' + this.get("item.minute");
        return myOptions;
    }),


    actions: {
        onChange(selectedTime) {
            //console.log(selectedTime);
            this.get('item').set('hour', selectedTime.getHours());
            this.get('item').set('minute', selectedTime.getMinutes());

        }
    }
});
