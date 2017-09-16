import Ember from 'ember';

const {
  Component,
  set,
  get,
  inject,
  computed,
  isEmpty,
  RSVP
} = Ember;

export default Component.extend({
  toast: inject.service(),
  store: inject.service(),
  init: function(){
    this.set("cardChangeset.expirationDate", {});
    this._super(...arguments);
  },
  isConfirming: false,
  states: computed('cardChangeset.country.id', function() {
    const countryId = get(this, 'cardChangeset.country.id');
    return isEmpty(countryId) ? RSVP.resolve() : get(this, 'store').query('location', {
      country: countryId
    });
  }),
  months: computed("cardChangeset.expirationDate.year", function(){
    if(!this.get("cardChangeset.expirationDate.year") || (this.get("cardChangeset.expirationDate.year") && this.get("cardChangeset.expirationDate.year")>new Date().getFullYear()%2000)){
      return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    }
    else{
      var monthsArr = [];
      var currentMonth = new Date().getMonth();
      for(var i=currentMonth+1; i<=12; i++){
        var monthStr = i + "";
        if(monthStr.length==1){
          monthsArr.push("0" + monthStr);
        }
        else{
          monthsArr.push(monthStr);
        }
      }
      return monthsArr;
    }
  }),
  years: computed(function(){
    var startYear = new Date().getFullYear()%2000;
    var endYear = 99;
    var years = [];
    for(var i=startYear; i<=endYear; i++){
      years.push(i);
    }
    return years;
  }),
  expDate: Ember.observer("cardChangeset.expirationDate.month", "cardChangeset.expirationDate.year", function(){
    var expDate;
    if(this.get("cardChangeset.expirationDate.month") && this.get("cardChangeset.expirationDate.year")){
      expDate = this.get("cardChangeset.expirationDate.month") + this.get("cardChangeset.expirationDate.year");
    }
    this.set("cardChangeset.expDate", expDate);
  }),
  actions: {
    save() {
      const cardChangeset = this.get("cardChangeset");
      cardChangeset.validate().then(() => {
        if (cardChangeset.get('isValid')) {
          set(this, 'saving', true);
          cardChangeset.save().then(card => {
            set(this, 'saving', false);
            set(this, 'createNew', false);
            set(this, 'showCards', true);
            if(this.get('saveCallback')){
              this.sendAction('saveCallback', card);
            }
          }).catch(() => set(this, 'saving', false));
        }
      });
    },
    cancel(){
      set(this, 'showCards', true);
      this.set("createNew", false);
      if(this.get('cancelCallback')){
        this.sendAction('cancelCallback');
      }
    }
  }
});
