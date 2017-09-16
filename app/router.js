import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('notification', {
    path: '/notification/:notification_id'
  });

  this.route('index', {
    path: '/'
  }, function() {
    this.route('client', {
      path: '/',
      resetNamespace: true
    });

    this.route('user', {
      resetNamespace: true
    }, function() {
      this.route('setup');

      this.route('details');
      this.route('password');
      this.route('notification', function() {
        this.route('list', {
          path: '/'
        });
        this.route('manage');
      });
      this.route('cards')
    });

    this.route('setup', {
      resetNamespace: true
    }, function() {
      this.route('company', {
        path: '/'
      });
      this.route('subscription', {
        path: 'company/:company_id/subscription'
      });
      this.route('brand', {
        path: 'company/:company_id/brand'
      });
      this.route('audience', {
        path: 'company/:company_id/brand/:brand_id/audience'
      });
      this.route('schedule', {
        path: 'company/:company_id/brand/:brand_id/social'
      });
    });

    this.route('unverified-user', {
      resetNamespace: true
    });

    this.route('invite', {
      resetNamespace: true
    });

    this.route('company', {
      path: 'companies',
      resetNamespace: true
    }, function() {
      this.route('add');
      this.route('edit', {
        path: '/:company_id'
      }, function() {

        this.route('index');
        this.route('setup');
        this.route('balance');

        this.route('brands');
        this.route('branduser', {
          path: '/:brand_id/branduser'
        });
        this.route('details');
        this.route('subscription');
        this.route('payments');
        this.route('member', {
          path: '/members'
        }, function() {
          this.route('list', {
            path: '/'
          });
          this.route('edit', {
            path: '/:member_id'
          });
        });
        this.route('role', {
          path: '/roles'
        }, function() {
          this.route('list', {
            path: '/'
          });
          this.route('add');
          this.route('edit', {
            path: '/:role_id'
          });
        });
        this.route('invite', {
          path: '/invites'
        }, function() {
          this.route('list', {
            path: '/'
          });
          this.route('add');
        });

        this.route('brand', {
          resetNamespace: true
        }, function() {
          this.route('add');

          this.route('edit', {
            path: '/:brand_id'
          }, function() {
            this.route('setup');
            this.route('products', {}, function() {
              this.route('list', {
                path: '/'
              });
              this.route('add');
              this.route('edit', {
                path: '/:product_id/edit'
              });

              this.route('groups', function() {
                this.route('list', {
                  path: '/'
                });
                this.route('add');
                this.route('edit', {
                  path: '/:product_group_id/edit'
                });
              });
            });

            this.route('files');
            this.route('schedule');
            this.route('outbox');
            this.route('chat', function() {
              this.route('create');
              this.route('details', {
                path: '/:chatRoom_id'
              });
              this.route('settings', {
                path: '/settings/:chatRoom_id'
              });
            });
            this.route('assignments', function() {
              this.route('assigned');
              this.route('created');
              this.route('calendar');
            });
            this.route('dashboard', {
              path: '/'
            });
            this.route('details');

            this.route('socialaccounts', function() {
              this.route('list', {
                path: '/'
              });
              this.route('schedule', {
                path: '/:accountId/schedule'
              });
              this.route('addaccount');
              this.route('addsocial');
              this.route('addemail', {}, function() {
                this.route('list', {
                  path: '/'
                });
                this.route('incoming');
                this.route('outgoing');
              });
              this.route('addwordpress');
              this.route('addreview');
              this.route('settings', {
                path: '/:accountId/settings'
              });
            });
            this.route('team', function() {
              this.route('list', {
                path: '/'
              });
              this.route('invite');
              this.route('roles', function() {
                this.route('list', {
                  path: '/'
                });
                this.route('add');
                this.route('edit', {
                  path: '/:role_id/edit'
                });
                this.route('401');
              });

              this.route('user', {
                path: ':memberId'
              }, function() {
                this.route('edit');
                this.route('details');
                this.route('departments');
              });

              this.route('invites', function() {
                this.route('list');
              });
            });
            this.route('targetaudience', {
              path: 'audience'
            }, function() {
              this.route('list', {
                path: '/'
              });
              this.route('add');
              this.route('edit', {
                path: ':audience_id'
              });
            });
            this.route('goals', function() {
              this.route('list', {
                path: '/'
              });
              this.route('add');
              this.route('edit', {
                path: '/:goal_id/edit'
              });
            });
            this.route('post', function() {
              this.route('drafts');
              this.route('add');
              this.route('edit', {
                path: '/:post_id/edit'
              });
              this.route('transition', {
                path: '/:post_id/transition'
              });
              this.route('import');

            });
            this.route('reviewflow', function() {
              this.route('list', {
                path: '/'
              });
              this.route('channels', function() {
                this.route('list', {
                  path: '/'
                });
                this.route('add');
                this.route('edit', {
                  path: '/:channel_id/edit'
                });
              });
              this.route('departments', function() {
                this.route('list', {
                  path: '/'
                });
                this.route('add');

                this.route('edit', {
                  path: '/:department_id/edit'
                });
              });
            });

            this.route('category', {}, function() {
              this.route('list', {
                path: '/'
              });
              this.route('add');

              this.route('edit', {
                path: '/:category_id/edit'
              });
            });

            this.route('inbox', {}, function() {
              this.route('inbox', {
                path: '/'
              });
              this.route('archive');
              this.route('sent');
              this.route('room', {
                path: '/:room_id/room'
              });
            });
            this.route('campaigns', {}, function() {
              this.route('list', {
                path: '/'
              });
              this.route('add');
              this.route('schedule', {
                path: '/:campaign_id/schedule'
              });
              this.route('edit', {
                path: '/:campaign_id/edit'
              });

            });


            this.route('required');
          });
        });
      });
    });
  });

  this.route('signin');
  this.route('signup', function() {
    this.route('email', {
      path: '/:email'
    });
  });
  this.route('forgot');
  this.route('reset', {
    path: 'reset/:token'
  });
  this.route('verify', {
    path: 'verify/:token'
  });

  this.route('clean');



});
export default Router;
