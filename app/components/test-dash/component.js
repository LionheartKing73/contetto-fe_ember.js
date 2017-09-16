import Ember from 'ember';

export default Ember.Component.extend({
    testUrls: [],
    session: Ember.inject.service("session"),
    store: Ember.inject.service("store"),
    init() {
        this._super();
        this.set("testUrls", []);
        var brand = this.get("session.brand.id");
        /*      this.get("testUrls").push({
                  "url": "https://gke.contetto.io/inbox/v1/unarchived?brand=" + brand,
                  "title": "Inbox:Unarchived",
                  "chart": "none"
              });*/
        /*   this.get("testUrls").push({
               "url": "https://gke.contetto.io/inbox/v1/sent?brand=" + brand,
               "title": "Inbox:Sent",
               "chart": "none"
           });*/
        this.get("testUrls").push({
            "url": "https://gke.contetto.io/post-metrics/v1/impressionDemographics?account=59261a1fa30fa80001a319a7&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
            "title": "14 days impression demographics, gorgeous coffee fb",
            "chart": "none"
        });

        /* this.get("testUrls").push({
             "url": "https://gke.contetto.io/social-accounts/v1/pageMetricsDates?account=59261a1fa30fa80001a319a7&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
             "title": "14 days ago and now, followers gorgeous coffee fb",
             "chart": "none"
         });*/
        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/pageMetricsDates?brand=" + brand + "&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
            "title": "14 days ago and now, THIS BRAND, followers",
            "chart": "none"
        });
        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/pageEngagementDates?account=59261a1fa30fa80001a319a7&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
            "title": "14 days ago and now, ENGAGEMENT gorgeous coffee fb",
            "chart": "none"
        });
        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/pageEngagementDates?brand=" + brand + "&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
            "title": "14 days ago and now, THIS BRAND, engagement",
            "chart": "none"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/post-metrics/v1/interactions?account=59261a1fa30fa80001a319a7&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
            "title": "14 days ago and now, gorgeous fb, interactions",
            "chart": "none"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/post-metrics/v1/metricNames?account=59261a1fa30fa80001a319a7&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
            "title": "14 days ago and now, gorgeous fb, metric names",
            "chart": "none"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/post-metrics/v1/metricNames?brand=" + brand + "&date1=" + moment().subtract(14, "days").utc().format() + "&date2=" + moment().utc().format(),
            "title": "14 days ago and now, THIS BRAND, metric names",
            "chart": "none"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementCountGraph?metricName=likeCount&title=Like+count+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Likes&serieslabel=Post+Likes&brand=" + brand + "&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Post Likes over 14 Days, for BRAND LINE GRAPH",
            "chart": "yes"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementCountGraph?metricName=likeCount&title=Like+count+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Likes&serieslabel=Post+Likes&account=59261a1fa30fa80001a319a7&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Post Likes over 14 Days, for Gorgeous FB LINE GRAPH",
            "chart": "yes"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementABGraph?metricName=likeCount&title=Like+difference+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Likes&serieslabel=Post+Likes+by+Day&brand=" + brand + "&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Post Likes per day, over 14 Days, for BRAND (AB Graph) BAR GRAPH",
            "chart": "yes"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementABGraph?metricName=likeCount&title=Like+difference+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Likes&serieslabel=Post+Likes+by+Day&account=59261a1fa30fa80001a319a7&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Post Likes per day, over 14 Days, for Gorgeous FB (AB Graph) BAR GRAPH",
            "chart": "yes"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementABGraph?title=Total+Engagement+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Total+Engagement&serieslabel=Total+Engagement+by+Day&brand=" + brand + "&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Total per day, over 14 Days, for BRAND (AB Graph) BAR GRAPH",
            "chart": "yes"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementABGraph?title=Total+Engagement+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Total+Engagement&serieslabel=Total+Engagement+by+Day&account=59261a1fa30fa80001a319a7&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Total per day, over 14 Days, for Gorgeous FB (AB Graph) BAR GRAPH",
            "chart": "yes"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementCountGraph?title=Total+Engagement+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Total+Engagement&serieslabel=Total+Engagement&brand=" + brand + "&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Total per day, over 14 Days, for BRAND  LINE GRAPH",
            "chart": "yes"
        });

        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementCountGraph?title=Total+Engagement+over+14+days&xaxislabel=Post+14+Days&yaxislabel=Total+Engagement&serieslabel=Total+Engagement&account=59261a1fa30fa80001a319a7&fromDate=" + moment().subtract(14, "days").utc().format() + "&endDate=" + moment().utc().format(),
            "title": "Total per day, over 14 Days, for Gorgeous FB LINE GRAPH",
            "chart": "yes"
        });
        this.get("testUrls").push({
            "url": "https://gke.contetto.io/social-accounts/v1/engagementTimeframe?title=Engagement+Timeframe+Comparison+(Test)&series1Label=2+Days+Ago&series2Label=Yesterday&account=58e3d4eb3cad900001bb371f&series1StartDate=2017-05-21T00:00:00Z&series1EndDate=2017-05-22T00:00:00Z&&series2StartDate=2017-05-22T00:00:00Z&series2EndDate=2017-05-23T00:00:00Z&interval=hour",
            "title": "Engagement comparison of two timeframes",
            "chart": "yes"
        });

    }
});
