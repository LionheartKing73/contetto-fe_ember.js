import Ember from 'ember';
import moment from 'moment';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
  inject: {
    service
  }
} = Ember;


const BrandCampaignListRoute = Ember.Route.extend(AuthenticatedRouteMixin, {
  companyDetail: service('current-company'),

  model() {
    let _this = this;
    let brandId = this.get('companyDetail.data.brandId');

    if (brandId) {
      let defaultStatus = [{
        val: 'Pending',
        isChecked: true,
        status: 'pending',
        value: 1
      }, {
        val: 'Active',
        isChecked: true,
        status: 'active',
        value: 2
      }, {
        val: 'Complete',
        isChecked: true,
        status: 'complete',
        value: 3
      }, {
        val: 'Cancelled',
        isChecked: true,
        status: 'cancelled',
        value: 4
      }];

      let defaultTypes = [{
        val: 'Sales',
        isChecked: true,
        value: 0
      }, {
        val: 'General',
        isChecked: true,
        value: 1
      }];

      let getRandomColor = function() {
        let letters = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
      };

      let eventsArr = Ember.A([]);
      let campaignArr = Ember.A([]);

      return Ember.RSVP.hash({
        currDate: moment().format('YYYY-MM-DD h:mm a'),
        allEvents: eventsArr,
        events: eventsArr,
        filters: Ember.Object.create({
          status: defaultStatus,
          types: defaultTypes,
          campaignA: campaignArr,
        }),
        headerObj: Ember.Object.create({
          left: "prev,next today",
          center: "title",
          right: "month,agendaWeek,agendaDay"
        }),
        campaignList: this.store.query('campaign', {
          'brand': brandId
        }),
        postListing: this.store.query('posting', {
          'brand': brandId
        }).then((posts) => {
          let cpColor;
          let campaignId;
          let postDetail;
          const defaultColor = getRandomColor();

          posts.forEach(function(post) {
            postDetail = _this.store.peekRecord('posting', post.get('id'));
            cpColor = '';
            campaignId = '';

            let event = {
              isChecked: true,
              name: post.get('content'),
              id: post.get('id'),
              title: post.get('content'),
              start: post.get('createdAt'),
              end: post.get('createdAt'),
              allDay: false
            };

            if (!Ember.isEmpty(postDetail.belongsTo('campaign').id())) {
              campaignId = postDetail.get('campaign.id');

              if (campaignArr.filterBy('id', campaignId).get('length') === 0) {
                cpColor = getRandomColor();

                campaignArr.push({
                  campaignName: postDetail.get('campaign.name'),
                  id: campaignId,
                  isChecked: true,
                  status: postDetail.get('campaign.status'),
                  type: postDetail.get('campaign.type'),
                  bgColor: cpColor
                });
              }
              else {
                cpColor = campaignArr.findBy('id', campaignId).bgColor;
              }

              Ember.set(event, 'backgroundColor', cpColor);
              Ember.set(event, 'campaignName', postDetail.get('campaign.name'));
              Ember.set(event, 'campaignId', campaignId);
              Ember.set(event, 'status', postDetail.get('campaign.status'));
              Ember.set(event, 'type', postDetail.get('campaign.type'));
            }
            else {
              Ember.set(event, 'backgroundColor', defaultColor);
              Ember.set(event, 'campaignId', 'none');
              Ember.set(event, 'campaignName', '');
              Ember.set(event, 'status', '');
              Ember.set(event, 'type', '');
            }

            eventsArr.push(event);
          });

          campaignArr.push({
            campaignName: 'No Campaign',
            id: 'none',
            isChecked: true,
            status: '',
            type: '',
            bgColor: defaultColor
          });
        }),
        detail: Ember.Object.create({
          show: false,
          campaignId: '',
          campaignTitle: '',
          brandId: '',
          type: '',
          status: '',
          className: '',
          title: '',
          start: '',
          end: ''
        })
      });
    }

  }
});

export default BrandCampaignListRoute;
