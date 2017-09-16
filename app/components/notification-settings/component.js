import Ember from 'ember';


export default Ember.Component.extend({
    tfs: [{
        'id': 1,
        'name': 'Enabled'
    }, {
        'id': -1,
        'name': 'Disabled'
    }],
    emailTF: {
        'id': 1,
        'name': 'Enabled'
    },
    smsTF: {
        'id': -1,
        'name': 'Disabled'
    },

    toast: Ember.inject.service(),
    myTimezone: null,
    timeZoneOptionsSet: [],
    optionsStart: Ember.computed(function() {
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
        myOptions.defaultTime = this.get("model.user.dndStartHour") + ':' + this.get("model.user.dndStartMinute");
        return myOptions;
    }),

    optionsEnd: Ember.computed(function() {
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
        myOptions.defaultTime = this.get("model.user.dndEndHour") + ':' + this.get("model.user.dndEndMinute");
        return myOptions;
    }),
    ajax: Ember.inject.service("ajax"),
    session: Ember.inject.service("session"),
    store: Ember.inject.service("store"),
    allverified: Ember.computed('model.user.smsVerified', 'model.user.smsPhone', 'model.user.originalPhone', {get() {
            //     console.log("SMSV:" + this.get("model.user.smsVerified"));
            //   console.log("OP:" + this.get("originalPhone"));
            if (this.get("model.user.smsVerified") == true) {
                //                alert("true!");
                if (this.get("model.user.smsPhone") == this.get("originalPhone")) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                //              alert("else!");
                return false;
            }
        }
    }),
    smscode: null,
    init() {


        this._super();


    },
    originalPhone: null,
    didReceiveAttrs() {
        this.set("originalPhone", this.get("model.user.smsPhone"));
        if (this.get("model.user.allowEmail") === false) {
            this.send("emailTFSet", {
                'id': -1,
                'name': 'Disabled'
            });
        }
        //   console.log("SMS" + this.get("model.user.allowSMS"));
        if (this.get("model.user.allowSMS") === true) {
            this.send("smsTFSet", {
                'id': 1,
                'name': 'Disabled'
            });
        }

        var zones = [];
        this.timeZoneOptions.forEach(function(zone) {
            zones.push(zone.value);
        });
        this.set("timeZoneOptionsSet", zones);
        var btz = this.get("account.brand.timezone");
        if (btz != null && btz != "") {
            this.set("myTimezone", btz);
        }
        else {
            /*global moment*/
            this.set("myTimezone", moment.tz.guess());
        }
    },
    pushEnabled: false,
    tokenSaved: false,
    pushCheck() {

        // [START get_token]
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        var self = this;

        messaging.getToken()
            .then(function(currentToken) {
                if (currentToken) {
                    self.sendTokenToServer(currentToken);
                    self.set("pushEnabled", true);
                }
                else {
                    // Show permission request.
                    //    console.log('No Instance ID token available. Request permission to generate one.');
                    // Show permission UI.
                    self.set("pushEnabled", false);
                    self.set("tokenSaved", false);

                    messaging.requestPermission()
                        .then(function() {
                            console.log('Notification permission granted.');
                            alert("Permission is granted... setting up notifications!");
                            self.pushCheck();
                            // TODO(developer): Retrieve an Instance ID token for use with FCM.
                            // ...
                        })
                        .catch(function(err) {
                            console.log('Unable to get permission to notify.', err);
                            alert("Push notifications will not be enabled.");
                        });

                }
            })
            .catch(function(err) {
                console.log('An error occurred while retrieving token. ', err);

                self.set("tokenSaved", false);
            });
    },
    detectClient() {
        let nav = navigator.appVersion,
            os = 'unknown',
            client = (() => {
                let agent = navigator.userAgent,
                    engine = agent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [],
                    build;

                if (/trident/i.test(engine[1])) {
                    build = /\brv[ :]+(\d+)/g.exec(agent) || [];
                    return {
                        browser: 'IE',
                        version: (build[1] || '')
                    };
                }

                if (engine[1] === 'Chrome') {
                    build = agent.match(/\bOPR\/(\d+)/);

                    if (build !== null) {
                        return {
                            browser: 'Opera',
                            version: build[1]
                        };
                    }
                }

                engine = engine[2] ? [engine[1], engine[2]] : [navigator.appName, nav, '-?'];

                if ((build = agent.match(/version\/(\d+)/i)) !== null) {
                    engine.splice(1, 1, build[1]);
                }

                return {
                    browser: engine[0],
                    version: engine[1]
                };
            })();

        switch (true) {
            case nav.indexOf('Win') > -1:
                os = 'Windows';
                break;
            case nav.indexOf('Mac') > -1:
                os = 'MacOS';
                break;
            case nav.indexOf('X11') > -1:
                os = 'UNIX';
                break;
            case nav.indexOf('Linux') > -1:
                os = 'Linux';
                break;
        }

        client.os = os;
        return client;
    },
    sendTokenToServer(token) {
        var client = this.detectClient();
        var self = this;
        if (!this.get("tokenSaved")) {
            //   console.log('Sending token to server...');
            // TODO(developer): Send the current token to your server.
            //    alert("SEND " + token);
            var device = self.get("store").createRecord("device", {
                "platform": client.os,
                "deviceName": client.browser,
                "deviceType": client.version,
                "token": token,
                "userDeviceName": "Desktop Notifications"
            });

            device.save().then(function() {

                self.set("tokenSaved", true);
            });
        }
        else {
            //   console.log('Token already sent to server so won\'t send it again ' +
            //     'unless it changes');
        }
    },
    pushSetup: Ember.computed('pushEnabled', 'tokenSaved', {get() {
            if (this.get("pushEnabled") && this.get("tokenSaved")) {
                return true;
            }
            return false;
        }
    }),
    actions: {
        pushInit() {
            this.pushCheck();
        },
        setStart(time) {
            this.set('model.user.dndStartHour', time.getHours());
            this.set('model.user.dndStartMinute', time.getMinutes());

        },
        setEnd(time) {
            this.set('model.user.dndEndHour', time.getHours());
            this.set('model.user.dndEndMinute', time.getMinutes());

        },
        test(deviceid) {
            this.get("ajax").request("https://gke.contetto.io/users/v1/testDevice?device=" + deviceid).then((z) => {
                alert("Sent!");
            });
        },
        remove(device) {
            if (confirm("Remove device?")) {
                device.deleteRecord();
                device.save();
            }
        },
        mute(device) {
            device.set('isMute', true);
            device.save();
        },
        unmute(device) {
            device.set('isMute', false);
            device.save();
        },
        saveNotificationSettings() {
          this.set("saving", true);
            this.get("model.user").save().then(() => {
                this.get('toast').success('Notifications Settings been updated successfully');
                this.transitionTo("user.setup");
            }).finally(()=> { this.set("saving", false)});
        },
        verifyCode() {
            if (!Ember.isEmpty(this.get("smscode"))) {
                alert("Verifying code " + this.get("smscode"));
                this.get("ajax").request("https://gke.contetto.io/users/v1/verifySmsCode?user=" + this.get("model.user.id") + "&code=" + this.get("smscode")).then((response) => {
                    alert(response);
                });
            }

        },
        sendcode() {
            if (this.get("model.user.smsPhone") != "") {
                alert("Sending code to " + this.get("model.user.smsPhone"));
                this.get("ajax").request("https://gke.contetto.io/users/v1/sendVerificationCode?user=" + this.get("model.user.id") + "&number=" + this.get("model.user.smsPhone")).then((response) => {
                    alert(response);
                });
            }
        },
        updateSMSCode(c) {
            this.set("smscode", c);
        },

        emailTFSet(tf) {
            this.set('emailTF', tf);
            this.set("model.user.allowEmail", tf.id);

        },
        smsTFSet(tf) {
            this.set('smsTF', tf);
            this.set("model.user.allowSMS", tf.id);

        },
        setDNDTZ(tz) {
            this.set("model.user.dndTimezone", tz);

        },

    },

    timeZoneOptions: [{
        'value': 'Africa/Abidjan',
        'label': 'Africa/Abidjan'
    }, {
        'value': 'Africa/Accra',
        'label': 'Africa/Accra'
    }, {
        'value': 'Africa/Algiers',
        'label': 'Africa/Algiers'
    }, {
        'value': 'Africa/Bissau',
        'label': 'Africa/Bissau'
    }, {
        'value': 'Africa/Cairo',
        'label': 'Africa/Cairo'
    }, {
        'value': 'Africa/Casablanca',
        'label': 'Africa/Casablanca'
    }, {
        'value': 'Africa/Ceuta',
        'label': 'Africa/Ceuta'
    }, {
        'value': 'Africa/El_Aaiun',
        'label': 'Africa/El_Aaiun'
    }, {
        'value': 'Africa/Johannesburg',
        'label': 'Africa/Johannesburg'
    }, {
        'value': 'Africa/Khartoum',
        'label': 'Africa/Khartoum'
    }, {
        'value': 'Africa/Lagos',
        'label': 'Africa/Lagos'
    }, {
        'value': 'Africa/Maputo',
        'label': 'Africa/Maputo'
    }, {
        'value': 'Africa/Monrovia',
        'label': 'Africa/Monrovia'
    }, {
        'value': 'Africa/Nairobi',
        'label': 'Africa/Nairobi'
    }, {
        'value': 'Africa/Ndjamena',
        'label': 'Africa/Ndjamena'
    }, {
        'value': 'Africa/Tripoli',
        'label': 'Africa/Tripoli'
    }, {
        'value': 'Africa/Tunis',
        'label': 'Africa/Tunis'
    }, {
        'value': 'Africa/Windhoek',
        'label': 'Africa/Windhoek'
    }, {
        'value': 'America/Adak',
        'label': 'America/Adak'
    }, {
        'value': 'America/Anchorage',
        'label': 'America/Anchorage'
    }, {
        'value': 'America/Araguaina',
        'label': 'America/Araguaina'
    }, {
        'value': 'America/Argentina/Buenos_Aires',
        'label': 'America/Argentina/Buenos_Aires'
    }, {
        'value': 'America/Argentina/Catamarca',
        'label': 'America/Argentina/Catamarca'
    }, {
        'value': 'America/Argentina/Cordoba',
        'label': 'America/Argentina/Cordoba'
    }, {
        'value': 'America/Argentina/Jujuy',
        'label': 'America/Argentina/Jujuy'
    }, {
        'value': 'America/Argentina/La_Rioja',
        'label': 'America/Argentina/La_Rioja'
    }, {
        'value': 'America/Argentina/Mendoza',
        'label': 'America/Argentina/Mendoza'
    }, {
        'value': 'America/Argentina/Rio_Gallegos',
        'label': 'America/Argentina/Rio_Gallegos'
    }, {
        'value': 'America/Argentina/Salta',
        'label': 'America/Argentina/Salta'
    }, {
        'value': 'America/Argentina/San_Juan',
        'label': 'America/Argentina/San_Juan'
    }, {
        'value': 'America/Argentina/San_Luis',
        'label': 'America/Argentina/San_Luis'
    }, {
        'value': 'America/Argentina/Tucuman',
        'label': 'America/Argentina/Tucuman'
    }, {
        'value': 'America/Argentina/Ushuaia',
        'label': 'America/Argentina/Ushuaia'
    }, {
        'value': 'America/Asuncion',
        'label': 'America/Asuncion'
    }, {
        'value': 'America/Atikokan',
        'label': 'America/Atikokan'
    }, {
        'value': 'America/Bahia',
        'label': 'America/Bahia'
    }, {
        'value': 'America/Bahia_Banderas',
        'label': 'America/Bahia_Banderas'
    }, {
        'value': 'America/Barbados',
        'label': 'America/Barbados'
    }, {
        'value': 'America/Belem',
        'label': 'America/Belem'
    }, {
        'value': 'America/Belize',
        'label': 'America/Belize'
    }, {
        'value': 'America/Blanc-Sablon',
        'label': 'America/Blanc-Sablon'
    }, {
        'value': 'America/Boa_Vista',
        'label': 'America/Boa_Vista'
    }, {
        'value': 'America/Bogota',
        'label': 'America/Bogota'
    }, {
        'value': 'America/Boise',
        'label': 'America/Boise'
    }, {
        'value': 'America/Cambridge_Bay',
        'label': 'America/Cambridge_Bay'
    }, {
        'value': 'America/Campo_Grande',
        'label': 'America/Campo_Grande'
    }, {
        'value': 'America/Cancun',
        'label': 'America/Cancun'
    }, {
        'value': 'America/Caracas',
        'label': 'America/Caracas'
    }, {
        'value': 'America/Cayenne',
        'label': 'America/Cayenne'
    }, {
        'value': 'America/Chicago',
        'label': 'America/Chicago'
    }, {
        'value': 'America/Chihuahua',
        'label': 'America/Chihuahua'
    }, {
        'value': 'America/Costa_Rica',
        'label': 'America/Costa_Rica'
    }, {
        'value': 'America/Creston',
        'label': 'America/Creston'
    }, {
        'value': 'America/Cuiaba',
        'label': 'America/Cuiaba'
    }, {
        'value': 'America/Curacao',
        'label': 'America/Curacao'
    }, {
        'value': 'America/Danmarkshavn',
        'label': 'America/Danmarkshavn'
    }, {
        'value': 'America/Dawson',
        'label': 'America/Dawson'
    }, {
        'value': 'America/Dawson_Creek',
        'label': 'America/Dawson_Creek'
    }, {
        'value': 'America/Denver',
        'label': 'America/Denver'
    }, {
        'value': 'America/Detroit',
        'label': 'America/Detroit'
    }, {
        'value': 'America/Edmonton',
        'label': 'America/Edmonton'
    }, {
        'value': 'America/Eirunepe',
        'label': 'America/Eirunepe'
    }, {
        'value': 'America/El_Salvador',
        'label': 'America/El_Salvador'
    }, {
        'value': 'America/Fort_Nelson',
        'label': 'America/Fort_Nelson'
    }, {
        'value': 'America/Fort_Wayne',
        'label': 'America/Fort_Wayne'
    }, {
        'value': 'America/Fortaleza',
        'label': 'America/Fortaleza'
    }, {
        'value': 'America/Glace_Bay',
        'label': 'America/Glace_Bay'
    }, {
        'value': 'America/Godthab',
        'label': 'America/Godthab'
    }, {
        'value': 'America/Goose_Bay',
        'label': 'America/Goose_Bay'
    }, {
        'value': 'America/Grand_Turk',
        'label': 'America/Grand_Turk'
    }, {
        'value': 'America/Guatemala',
        'label': 'America/Guatemala'
    }, {
        'value': 'America/Guayaquil',
        'label': 'America/Guayaquil'
    }, {
        'value': 'America/Guyana',
        'label': 'America/Guyana'
    }, {
        'value': 'America/Halifax',
        'label': 'America/Halifax'
    }, {
        'value': 'America/Havana',
        'label': 'America/Havana'
    }, {
        'value': 'America/Hermosillo',
        'label': 'America/Hermosillo'
    }, {
        'value': 'America/Indiana/Knox',
        'label': 'America/Indiana/Knox'
    }, {
        'value': 'America/Indiana/Marengo',
        'label': 'America/Indiana/Marengo'
    }, {
        'value': 'America/Indiana/Petersburg',
        'label': 'America/Indiana/Petersburg'
    }, {
        'value': 'America/Indiana/Tell_City',
        'label': 'America/Indiana/Tell_City'
    }, {
        'value': 'America/Indiana/Vevay',
        'label': 'America/Indiana/Vevay'
    }, {
        'value': 'America/Indiana/Vincennes',
        'label': 'America/Indiana/Vincennes'
    }, {
        'value': 'America/Indiana/Winamac',
        'label': 'America/Indiana/Winamac'
    }, {
        'value': 'America/Inuvik',
        'label': 'America/Inuvik'
    }, {
        'value': 'America/Iqaluit',
        'label': 'America/Iqaluit'
    }, {
        'value': 'America/Jamaica',
        'label': 'America/Jamaica'
    }, {
        'value': 'America/Juneau',
        'label': 'America/Juneau'
    }, {
        'value': 'America/Kentucky/Louisville',
        'label': 'America/Kentucky/Louisville'
    }, {
        'value': 'America/Kentucky/Monticello',
        'label': 'America/Kentucky/Monticello'
    }, {
        'value': 'America/La_Paz',
        'label': 'America/La_Paz'
    }, {
        'value': 'America/Lima',
        'label': 'America/Lima'
    }, {
        'value': 'America/Los_Angeles',
        'label': 'America/Los_Angeles'
    }, {
        'value': 'America/Maceio',
        'label': 'America/Maceio'
    }, {
        'value': 'America/Managua',
        'label': 'America/Managua'
    }, {
        'value': 'America/Manaus',
        'label': 'America/Manaus'
    }, {
        'value': 'America/Martinique',
        'label': 'America/Martinique'
    }, {
        'value': 'America/Matamoros',
        'label': 'America/Matamoros'
    }, {
        'value': 'America/Mazatlan',
        'label': 'America/Mazatlan'
    }, {
        'value': 'America/Menominee',
        'label': 'America/Menominee'
    }, {
        'value': 'America/Merida',
        'label': 'America/Merida'
    }, {
        'value': 'America/Metlakatla',
        'label': 'America/Metlakatla'
    }, {
        'value': 'America/Mexico_City',
        'label': 'America/Mexico_City'
    }, {
        'value': 'America/Miquelon',
        'label': 'America/Miquelon'
    }, {
        'value': 'America/Moncton',
        'label': 'America/Moncton'
    }, {
        'value': 'America/Monterrey',
        'label': 'America/Monterrey'
    }, {
        'value': 'America/Montevideo',
        'label': 'America/Montevideo'
    }, {
        'value': 'America/Nassau',
        'label': 'America/Nassau'
    }, {
        'value': 'America/New_York',
        'label': 'America/New_York'
    }, {
        'value': 'America/Nipigon',
        'label': 'America/Nipigon'
    }, {
        'value': 'America/Nome',
        'label': 'America/Nome'
    }, {
        'value': 'America/Noronha',
        'label': 'America/Noronha'
    }, {
        'value': 'America/North_Dakota/Beulah',
        'label': 'America/North_Dakota/Beulah'
    }, {
        'value': 'America/North_Dakota/Center',
        'label': 'America/North_Dakota/Center'
    }, {
        'value': 'America/North_Dakota/New_Salem',
        'label': 'America/North_Dakota/New_Salem'
    }, {
        'value': 'America/Ojinaga',
        'label': 'America/Ojinaga'
    }, {
        'value': 'America/Panama',
        'label': 'America/Panama'
    }, {
        'value': 'America/Pangnirtung',
        'label': 'America/Pangnirtung'
    }, {
        'value': 'America/Paramaribo',
        'label': 'America/Paramaribo'
    }, {
        'value': 'America/Phoenix',
        'label': 'America/Phoenix'
    }, {
        'value': 'America/Port-au-Prince',
        'label': 'America/Port-au-Prince'
    }, {
        'value': 'America/Port_of_Spain',
        'label': 'America/Port_of_Spain'
    }, {
        'value': 'America/Porto_Velho',
        'label': 'America/Porto_Velho'
    }, {
        'value': 'America/Puerto_Rico',
        'label': 'America/Puerto_Rico'
    }, {
        'value': 'America/Rainy_River',
        'label': 'America/Rainy_River'
    }, {
        'value': 'America/Rankin_Inlet',
        'label': 'America/Rankin_Inlet'
    }, {
        'value': 'America/Recife',
        'label': 'America/Recife'
    }, {
        'value': 'America/Regina',
        'label': 'America/Regina'
    }, {
        'value': 'America/Resolute',
        'label': 'America/Resolute'
    }, {
        'value': 'America/Rio_Branco',
        'label': 'America/Rio_Branco'
    }, {
        'value': 'America/Santarem',
        'label': 'America/Santarem'
    }, {
        'value': 'America/Santiago',
        'label': 'America/Santiago'
    }, {
        'value': 'America/Santo_Domingo',
        'label': 'America/Santo_Domingo'
    }, {
        'value': 'America/Sao_Paulo',
        'label': 'America/Sao_Paulo'
    }, {
        'value': 'America/Scoresbysund',
        'label': 'America/Scoresbysund'
    }, {
        'value': 'America/Sitka',
        'label': 'America/Sitka'
    }, {
        'value': 'America/St_Johns',
        'label': 'America/St_Johns'
    }, {
        'value': 'America/Swift_Current',
        'label': 'America/Swift_Current'
    }, {
        'value': 'America/Tegucigalpa',
        'label': 'America/Tegucigalpa'
    }, {
        'value': 'America/Thule',
        'label': 'America/Thule'
    }, {
        'value': 'America/Thunder_Bay',
        'label': 'America/Thunder_Bay'
    }, {
        'value': 'America/Tijuana',
        'label': 'America/Tijuana'
    }, {
        'value': 'America/Toronto',
        'label': 'America/Toronto'
    }, {
        'value': 'America/Vancouver',
        'label': 'America/Vancouver'
    }, {
        'value': 'America/Whitehorse',
        'label': 'America/Whitehorse'
    }, {
        'value': 'America/Winnipeg',
        'label': 'America/Winnipeg'
    }, {
        'value': 'America/Yakutat',
        'label': 'America/Yakutat'
    }, {
        'value': 'America/Yellowknife',
        'label': 'America/Yellowknife'
    }, {
        'value': 'Antarctica/Casey',
        'label': 'Antarctica/Casey'
    }, {
        'value': 'Antarctica/Davis',
        'label': 'Antarctica/Davis'
    }, {
        'value': 'Antarctica/DumontDUrville',
        'label': 'Antarctica/DumontDUrville'
    }, {
        'value': 'Antarctica/Macquarie',
        'label': 'Antarctica/Macquarie'
    }, {
        'value': 'Antarctica/Mawson',
        'label': 'Antarctica/Mawson'
    }, {
        'value': 'Antarctica/Palmer',
        'label': 'Antarctica/Palmer'
    }, {
        'value': 'Antarctica/Rothera',
        'label': 'Antarctica/Rothera'
    }, {
        'value': 'Antarctica/Syowa',
        'label': 'Antarctica/Syowa'
    }, {
        'value': 'Antarctica/Troll',
        'label': 'Antarctica/Troll'
    }, {
        'value': 'Antarctica/Vostok',
        'label': 'Antarctica/Vostok'
    }, {
        'value': 'Asia/Almaty',
        'label': 'Asia/Almaty'
    }, {
        'value': 'Asia/Amman',
        'label': 'Asia/Amman'
    }, {
        'value': 'Asia/Anadyr',
        'label': 'Asia/Anadyr'
    }, {
        'value': 'Asia/Aqtau',
        'label': 'Asia/Aqtau'
    }, {
        'value': 'Asia/Aqtobe',
        'label': 'Asia/Aqtobe'
    }, {
        'value': 'Asia/Ashgabat',
        'label': 'Asia/Ashgabat'
    }, {
        'value': 'Asia/Baghdad',
        'label': 'Asia/Baghdad'
    }, {
        'value': 'Asia/Baku',
        'label': 'Asia/Baku'
    }, {
        'value': 'Asia/Bangkok',
        'label': 'Asia/Bangkok'
    }, {
        'value': 'Asia/Barnaul',
        'label': 'Asia/Barnaul'
    }, {
        'value': 'Asia/Beirut',
        'label': 'Asia/Beirut'
    }, {
        'value': 'Asia/Bishkek',
        'label': 'Asia/Bishkek'
    }, {
        'value': 'Asia/Brunei',
        'label': 'Asia/Brunei'
    }, {
        'value': 'Asia/Chita',
        'label': 'Asia/Chita'
    }, {
        'value': 'Asia/Choibalsan',
        'label': 'Asia/Choibalsan'
    }, {
        'value': 'Asia/Colombo',
        'label': 'Asia/Colombo'
    }, {
        'value': 'Asia/Damascus',
        'label': 'Asia/Damascus'
    }, {
        'value': 'Asia/Dhaka',
        'label': 'Asia/Dhaka'
    }, {
        'value': 'Asia/Dili',
        'label': 'Asia/Dili'
    }, {
        'value': 'Asia/Dubai',
        'label': 'Asia/Dubai'
    }, {
        'value': 'Asia/Dushanbe',
        'label': 'Asia/Dushanbe'
    }, {
        'value': 'Asia/Famagusta',
        'label': 'Asia/Famagusta'
    }, {
        'value': 'Asia/Gaza',
        'label': 'Asia/Gaza'
    }, {
        'value': 'Asia/Hebron',
        'label': 'Asia/Hebron'
    }, {
        'value': 'Asia/Ho_Chi_Minh',
        'label': 'Asia/Ho_Chi_Minh'
    }, {
        'value': 'Asia/Hong_Kong',
        'label': 'Asia/Hong_Kong'
    }, {
        'value': 'Asia/Hovd',
        'label': 'Asia/Hovd'
    }, {
        'value': 'Asia/Irkutsk',
        'label': 'Asia/Irkutsk'
    }, {
        'value': 'Asia/Jakarta',
        'label': 'Asia/Jakarta'
    }, {
        'value': 'Asia/Jayapura',
        'label': 'Asia/Jayapura'
    }, {
        'value': 'Asia/Jerusalem',
        'label': 'Asia/Jerusalem'
    }, {
        'value': 'Asia/Kabul',
        'label': 'Asia/Kabul'
    }, {
        'value': 'Asia/Kamchatka',
        'label': 'Asia/Kamchatka'
    }, {
        'value': 'Asia/Karachi',
        'label': 'Asia/Karachi'
    }, {
        'value': 'Asia/Kathmandu',
        'label': 'Asia/Kathmandu'
    }, {
        'value': 'Asia/Khandyga',
        'label': 'Asia/Khandyga'
    }, {
        'value': 'Asia/Kolkata',
        'label': 'Asia/Kolkata'
    }, {
        'value': 'Asia/Krasnoyarsk',
        'label': 'Asia/Krasnoyarsk'
    }, {
        'value': 'Asia/Kuala_Lumpur',
        'label': 'Asia/Kuala_Lumpur'
    }, {
        'value': 'Asia/Kuching',
        'label': 'Asia/Kuching'
    }, {
        'value': 'Asia/Macau',
        'label': 'Asia/Macau'
    }, {
        'value': 'Asia/Magadan',
        'label': 'Asia/Magadan'
    }, {
        'value': 'Asia/Makassar',
        'label': 'Asia/Makassar'
    }, {
        'value': 'Asia/Manila',
        'label': 'Asia/Manila'
    }, {
        'value': 'Asia/Nicosia',
        'label': 'Asia/Nicosia'
    }, {
        'value': 'Asia/Novokuznetsk',
        'label': 'Asia/Novokuznetsk'
    }, {
        'value': 'Asia/Novosibirsk',
        'label': 'Asia/Novosibirsk'
    }, {
        'value': 'Asia/Omsk',
        'label': 'Asia/Omsk'
    }, {
        'value': 'Asia/Oral',
        'label': 'Asia/Oral'
    }, {
        'value': 'Asia/Pontianak',
        'label': 'Asia/Pontianak'
    }, {
        'value': 'Asia/Pyongyang',
        'label': 'Asia/Pyongyang'
    }, {
        'value': 'Asia/Qatar',
        'label': 'Asia/Qatar'
    }, {
        'value': 'Asia/Qyzylorda',
        'label': 'Asia/Qyzylorda'
    }, {
        'value': 'Asia/Rangoon',
        'label': 'Asia/Rangoon'
    }, {
        'value': 'Asia/Riyadh',
        'label': 'Asia/Riyadh'
    }, {
        'value': 'Asia/Sakhalin',
        'label': 'Asia/Sakhalin'
    }, {
        'value': 'Asia/Samarkand',
        'label': 'Asia/Samarkand'
    }, {
        'value': 'Asia/Seoul',
        'label': 'Asia/Seoul'
    }, {
        'value': 'Asia/Shanghai',
        'label': 'Asia/Shanghai'
    }, {
        'value': 'Asia/Singapore',
        'label': 'Asia/Singapore'
    }, {
        'value': 'Asia/Srednekolymsk',
        'label': 'Asia/Srednekolymsk'
    }, {
        'value': 'Asia/Taipei',
        'label': 'Asia/Taipei'
    }, {
        'value': 'Asia/Tashkent',
        'label': 'Asia/Tashkent'
    }, {
        'value': 'Asia/Tbilisi',
        'label': 'Asia/Tbilisi'
    }, {
        'value': 'Asia/Tehran',
        'label': 'Asia/Tehran'
    }, {
        'value': 'Asia/Thimphu',
        'label': 'Asia/Thimphu'
    }, {
        'value': 'Asia/Tokyo',
        'label': 'Asia/Tokyo'
    }, {
        'value': 'Asia/Tomsk',
        'label': 'Asia/Tomsk'
    }, {
        'value': 'Asia/Ulaanbaatar',
        'label': 'Asia/Ulaanbaatar'
    }, {
        'value': 'Asia/Urumqi',
        'label': 'Asia/Urumqi'
    }, {
        'value': 'Asia/Ust-Nera',
        'label': 'Asia/Ust-Nera'
    }, {
        'value': 'Asia/Vladivostok',
        'label': 'Asia/Vladivostok'
    }, {
        'value': 'Asia/Yakutsk',
        'label': 'Asia/Yakutsk'
    }, {
        'value': 'Asia/Yekaterinburg',
        'label': 'Asia/Yekaterinburg'
    }, {
        'value': 'Asia/Yerevan',
        'label': 'Asia/Yerevan'
    }, {
        'value': 'Atlantic/Azores',
        'label': 'Atlantic/Azores'
    }, {
        'value': 'Atlantic/Bermuda',
        'label': 'Atlantic/Bermuda'
    }, {
        'value': 'Atlantic/Canary',
        'label': 'Atlantic/Canary'
    }, {
        'value': 'Atlantic/Cape_Verde',
        'label': 'Atlantic/Cape_Verde'
    }, {
        'value': 'Atlantic/Faroe',
        'label': 'Atlantic/Faroe'
    }, {
        'value': 'Atlantic/Madeira',
        'label': 'Atlantic/Madeira'
    }, {
        'value': 'Atlantic/Reykjavik',
        'label': 'Atlantic/Reykjavik'
    }, {
        'value': 'Atlantic/South_Georgia',
        'label': 'Atlantic/South_Georgia'
    }, {
        'value': 'Atlantic/Stanley',
        'label': 'Atlantic/Stanley'
    }, {
        'value': 'Australia/Adelaide',
        'label': 'Australia/Adelaide'
    }, {
        'value': 'Australia/Brisbane',
        'label': 'Australia/Brisbane'
    }, {
        'value': 'Australia/Broken_Hill',
        'label': 'Australia/Broken_Hill'
    }, {
        'value': 'Australia/Currie',
        'label': 'Australia/Currie'
    }, {
        'value': 'Australia/Darwin',
        'label': 'Australia/Darwin'
    }, {
        'value': 'Australia/Eucla',
        'label': 'Australia/Eucla'
    }, {
        'value': 'Australia/Hobart',
        'label': 'Australia/Hobart'
    }, {
        'value': 'Australia/Lindeman',
        'label': 'Australia/Lindeman'
    }, {
        'value': 'Australia/Lord_Howe',
        'label': 'Australia/Lord_Howe'
    }, {
        'value': 'Australia/Melbourne',
        'label': 'Australia/Melbourne'
    }, {
        'value': 'Australia/Perth',
        'label': 'Australia/Perth'
    }, {
        'value': 'Australia/Sydney',
        'label': 'Australia/Sydney'
    }, {
        'value': 'Etc/GMT+0',
        'label': 'Etc/GMT+0'
    }, {
        'value': 'Etc/GMT+1',
        'label': 'Etc/GMT+1'
    }, {
        'value': 'Etc/GMT+10',
        'label': 'Etc/GMT+10'
    }, {
        'value': 'Etc/GMT+11',
        'label': 'Etc/GMT+11'
    }, {
        'value': 'Etc/GMT+12',
        'label': 'Etc/GMT+12'
    }, {
        'value': 'Etc/GMT+2',
        'label': 'Etc/GMT+2'
    }, {
        'value': 'Etc/GMT+3',
        'label': 'Etc/GMT+3'
    }, {
        'value': 'Etc/GMT+4',
        'label': 'Etc/GMT+4'
    }, {
        'value': 'Etc/GMT+5',
        'label': 'Etc/GMT+5'
    }, {
        'value': 'Etc/GMT+6',
        'label': 'Etc/GMT+6'
    }, {
        'value': 'Etc/GMT+7',
        'label': 'Etc/GMT+7'
    }, {
        'value': 'Etc/GMT+8',
        'label': 'Etc/GMT+8'
    }, {
        'value': 'Etc/GMT+9',
        'label': 'Etc/GMT+9'
    }, {
        'value': 'Etc/GMT-1',
        'label': 'Etc/GMT-1'
    }, {
        'value': 'Etc/GMT-10',
        'label': 'Etc/GMT-10'
    }, {
        'value': 'Etc/GMT-11',
        'label': 'Etc/GMT-11'
    }, {
        'value': 'Etc/GMT-12',
        'label': 'Etc/GMT-12'
    }, {
        'value': 'Etc/GMT-13',
        'label': 'Etc/GMT-13'
    }, {
        'value': 'Etc/GMT-14',
        'label': 'Etc/GMT-14'
    }, {
        'value': 'Etc/GMT-2',
        'label': 'Etc/GMT-2'
    }, {
        'value': 'Etc/GMT-3',
        'label': 'Etc/GMT-3'
    }, {
        'value': 'Etc/GMT-4',
        'label': 'Etc/GMT-4'
    }, {
        'value': 'Etc/GMT-5',
        'label': 'Etc/GMT-5'
    }, {
        'value': 'Etc/GMT-6',
        'label': 'Etc/GMT-6'
    }, {
        'value': 'Etc/GMT-7',
        'label': 'Etc/GMT-7'
    }, {
        'value': 'Etc/GMT-8',
        'label': 'Etc/GMT-8'
    }, {
        'value': 'Etc/GMT-9',
        'label': 'Etc/GMT-9'
    }, {
        'value': 'Etc/UCT',
        'label': 'Etc/UCT'
    }, {
        'value': 'Etc/UTC',
        'label': 'Etc/UTC'
    }, {
        'value': 'Europe/Amsterdam',
        'label': 'Europe/Amsterdam'
    }, {
        'value': 'Europe/Andorra',
        'label': 'Europe/Andorra'
    }, {
        'value': 'Europe/Astrakhan',
        'label': 'Europe/Astrakhan'
    }, {
        'value': 'Europe/Athens',
        'label': 'Europe/Athens'
    }, {
        'value': 'Europe/Belgrade',
        'label': 'Europe/Belgrade'
    }, {
        'value': 'Europe/Berlin',
        'label': 'Europe/Berlin'
    }, {
        'value': 'Europe/Brussels',
        'label': 'Europe/Brussels'
    }, {
        'value': 'Europe/Bucharest',
        'label': 'Europe/Bucharest'
    }, {
        'value': 'Europe/Budapest',
        'label': 'Europe/Budapest'
    }, {
        'value': 'Europe/Chisinau',
        'label': 'Europe/Chisinau'
    }, {
        'value': 'Europe/Copenhagen',
        'label': 'Europe/Copenhagen'
    }, {
        'value': 'Europe/Dublin',
        'label': 'Europe/Dublin'
    }, {
        'value': 'Europe/Gibraltar',
        'label': 'Europe/Gibraltar'
    }, {
        'value': 'Europe/Helsinki',
        'label': 'Europe/Helsinki'
    }, {
        'value': 'Europe/Istanbul',
        'label': 'Europe/Istanbul'
    }, {
        'value': 'Europe/Kaliningrad',
        'label': 'Europe/Kaliningrad'
    }, {
        'value': 'Europe/Kiev',
        'label': 'Europe/Kiev'
    }, {
        'value': 'Europe/Kirov',
        'label': 'Europe/Kirov'
    }, {
        'value': 'Europe/Lisbon',
        'label': 'Europe/Lisbon'
    }, {
        'value': 'Europe/London',
        'label': 'Europe/London'
    }, {
        'value': 'Europe/Luxembourg',
        'label': 'Europe/Luxembourg'
    }, {
        'value': 'Europe/Madrid',
        'label': 'Europe/Madrid'
    }, {
        'value': 'Europe/Malta',
        'label': 'Europe/Malta'
    }, {
        'value': 'Europe/Minsk',
        'label': 'Europe/Minsk'
    }, {
        'value': 'Europe/Monaco',
        'label': 'Europe/Monaco'
    }, {
        'value': 'Europe/Moscow',
        'label': 'Europe/Moscow'
    }, {
        'value': 'Europe/Oslo',
        'label': 'Europe/Oslo'
    }, {
        'value': 'Europe/Paris',
        'label': 'Europe/Paris'
    }, {
        'value': 'Europe/Prague',
        'label': 'Europe/Prague'
    }, {
        'value': 'Europe/Riga',
        'label': 'Europe/Riga'
    }, {
        'value': 'Europe/Rome',
        'label': 'Europe/Rome'
    }, {
        'value': 'Europe/Samara',
        'label': 'Europe/Samara'
    }, {
        'value': 'Europe/Simferopol',
        'label': 'Europe/Simferopol'
    }, {
        'value': 'Europe/Sofia',
        'label': 'Europe/Sofia'
    }, {
        'value': 'Europe/Stockholm',
        'label': 'Europe/Stockholm'
    }, {
        'value': 'Europe/Tallinn',
        'label': 'Europe/Tallinn'
    }, {
        'value': 'Europe/Tirane',
        'label': 'Europe/Tirane'
    }, {
        'value': 'Europe/Ulyanovsk',
        'label': 'Europe/Ulyanovsk'
    }, {
        'value': 'Europe/Uzhgorod',
        'label': 'Europe/Uzhgorod'
    }, {
        'value': 'Europe/Vienna',
        'label': 'Europe/Vienna'
    }, {
        'value': 'Europe/Vilnius',
        'label': 'Europe/Vilnius'
    }, {
        'value': 'Europe/Volgograd',
        'label': 'Europe/Volgograd'
    }, {
        'value': 'Europe/Warsaw',
        'label': 'Europe/Warsaw'
    }, {
        'value': 'Europe/Zaporozhye',
        'label': 'Europe/Zaporozhye'
    }, {
        'value': 'Europe/Zurich',
        'label': 'Europe/Zurich'
    }, {
        'value': 'Indian/Chagos',
        'label': 'Indian/Chagos'
    }, {
        'value': 'Indian/Christmas',
        'label': 'Indian/Christmas'
    }, {
        'value': 'Indian/Cocos',
        'label': 'Indian/Cocos'
    }, {
        'value': 'Indian/Kerguelen',
        'label': 'Indian/Kerguelen'
    }, {
        'value': 'Indian/Mahe',
        'label': 'Indian/Mahe'
    }, {
        'value': 'Indian/Maldives',
        'label': 'Indian/Maldives'
    }, {
        'value': 'Indian/Mauritius',
        'label': 'Indian/Mauritius'
    }, {
        'value': 'Indian/Reunion',
        'label': 'Indian/Reunion'
    }, {
        'value': 'Pacific/Apia',
        'label': 'Pacific/Apia'
    }, {
        'value': 'Pacific/Auckland',
        'label': 'Pacific/Auckland'
    }, {
        'value': 'Pacific/Bougainville',
        'label': 'Pacific/Bougainville'
    }, {
        'value': 'Pacific/Chatham',
        'label': 'Pacific/Chatham'
    }, {
        'value': 'Pacific/Chuuk',
        'label': 'Pacific/Chuuk'
    }, {
        'value': 'Pacific/Easter',
        'label': 'Pacific/Easter'
    }, {
        'value': 'Pacific/Efate',
        'label': 'Pacific/Efate'
    }, {
        'value': 'Pacific/Enderbury',
        'label': 'Pacific/Enderbury'
    }, {
        'value': 'Pacific/Fakaofo',
        'label': 'Pacific/Fakaofo'
    }, {
        'value': 'Pacific/Fiji',
        'label': 'Pacific/Fiji'
    }, {
        'value': 'Pacific/Funafuti',
        'label': 'Pacific/Funafuti'
    }, {
        'value': 'Pacific/Galapagos',
        'label': 'Pacific/Galapagos'
    }, {
        'value': 'Pacific/Gambier',
        'label': 'Pacific/Gambier'
    }, {
        'value': 'Pacific/Guadalcanal',
        'label': 'Pacific/Guadalcanal'
    }, {
        'value': 'Pacific/Guam',
        'label': 'Pacific/Guam'
    }, {
        'value': 'Pacific/Honolulu',
        'label': 'Pacific/Honolulu'
    }, {
        'value': 'Pacific/Kiritimati',
        'label': 'Pacific/Kiritimati'
    }, {
        'value': 'Pacific/Kosrae',
        'label': 'Pacific/Kosrae'
    }, {
        'value': 'Pacific/Kwajalein',
        'label': 'Pacific/Kwajalein'
    }, {
        'value': 'Pacific/Majuro',
        'label': 'Pacific/Majuro'
    }, {
        'value': 'Pacific/Marquesas',
        'label': 'Pacific/Marquesas'
    }, {
        'value': 'Pacific/Nauru',
        'label': 'Pacific/Nauru'
    }, {
        'value': 'Pacific/Niue',
        'label': 'Pacific/Niue'
    }, {
        'value': 'Pacific/Norfolk',
        'label': 'Pacific/Norfolk'
    }, {
        'value': 'Pacific/Noumea',
        'label': 'Pacific/Noumea'
    }, {
        'value': 'Pacific/Pago_Pago',
        'label': 'Pacific/Pago_Pago'
    }, {
        'value': 'Pacific/Palau',
        'label': 'Pacific/Palau'
    }, {
        'value': 'Pacific/Pitcairn',
        'label': 'Pacific/Pitcairn'
    }, {
        'value': 'Pacific/Pohnpei',
        'label': 'Pacific/Pohnpei'
    }, {
        'value': 'Pacific/Port_Moresby',
        'label': 'Pacific/Port_Moresby'
    }, {
        'value': 'Pacific/Rarotonga',
        'label': 'Pacific/Rarotonga'
    }, {
        'value': 'Pacific/Tahiti',
        'label': 'Pacific/Tahiti'
    }, {
        'value': 'Pacific/Tarawa',
        'label': 'Pacific/Tarawa'
    }, {
        'value': 'Pacific/Tongatapu',
        'label': 'Pacific/Tongatapu'
    }, {
        'value': 'Pacific/Wake',
        'label': 'Pacific/Wake'
    }, {
        'value': 'Pacific/Wallis',
        'label': 'Pacific/Wallis'
    }],
});
