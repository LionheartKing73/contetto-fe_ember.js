import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    filter(type, value) {
      let cacheData;

      if (type === 'campaign') {
        cacheData = this.get('model.filters.campaignA').findBy("id", value);
      }
      else if (type === 'types') {
        cacheData = this.get('model.filters.types').findBy("value", value);
      }
      else if (type === 'status') {
        cacheData = this.get('model.filters.status').findBy("value", value);
      }

      if (cacheData.isChecked) {
        Ember.set(cacheData, 'isChecked', false);
      }
      else {
        Ember.set(cacheData, 'isChecked', true);
      }

      this.send('filterData');
    },

    filterData() {
      let _this = this;
      let filterData = [];

      Ember.$('.full-calendar').fullCalendar('removeEvents');

      this.get('model.allEvents').forEach(function(item) {
        let filterType = '';
        let filterStatus = '';
        let filterCampaign = '';

        if (item.campaignId !== 'none') {
          filterCampaign = _this.get('model.filters.campaignA').findBy("id", item.campaignId);

          if (filterCampaign.isChecked) {


            if (!Ember.isEmpty(item.type)) {
              filterType = _this.get('model.filters.types').findBy('value', item.type);

            }

            if (!Ember.isEmpty(item.status)) {
              filterStatus = _this.get('model.filters.status').findBy("value", item.status);
            }

            if (!Ember.isEmpty(filterType) && !Ember.isEmpty(filterStatus)) {

              if (filterType.isChecked && filterStatus.isChecked) {
                filterData.push(item);
              }
            }

          }

        }
        else {
          let noCampaign = _this.get('model.filters.campaignA').findBy("id", "none");

          if (noCampaign.isChecked) {
            filterData.push(item);

          }
        }
      });

      this.set('model.events', filterData);
    },

    showDetail(event) {
      let type = (event.type === "1") ? 'Sales' : 'General';
      let status;

      switch (event.status) {
        case 1:
          status = 'Pending';
          break;
        case 2:
          status = 'Active';
          break;
        case 3:
          status = 'Complete';
          break;
        case 4:
          status = 'Cancelled';
          break;
      }

      this.set('model.detail', Ember.Object.create({
        show: true,
        campaignId: event.campaignId,
        campaignTitle: event.campaignName,
        type: type,
        status: status,
        className: event.className,
        title: event.title,
        start: event.start,
        end: event.end
      }));
    },

    closeDetail() {
      this.set('model.detail', Ember.Object.create({
        show: false,
        campaignId: '',
        campaignTitle: '',
        type: '',
        status: '',
        className: '',
        title: '',
        start: '',
        end: ''
      }));
    }
  }
});
