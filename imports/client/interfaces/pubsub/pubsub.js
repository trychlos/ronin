/*
    jQuery pub/sub plugin by Peter Higgins
    https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js

    Modified by Tobin Bradley
    http://fuzzytolerance.info/blog/2012/05/31/2012-05-31-an-improved-pubsub-for-jquery/

    AFL/BSD Licensed

    pwi 2020- 2-11 analyze

    https://github.com/digitalxero/jquery-pubsub
		pro: hierarchical categorical publish and subscribe
		con: namespace is $.pubsub.{publish,subscribe}
		sync
	http://fuzzytolerance.info/blog/2012/05/31/2012-05-31-an-improved-pubsub-for-jquery/
		pro: not dom based
		pro: subscribers list function
		sync
	https://github.com/mroderick/PubSubJS
		pro: hierarchical categorical publish and subscribe
		con: namespace is PubSub.publish('MY TOPIC', 'hello world!');
		con: distinguish between string and symbol
		async (lines 130-132)
		dependances free (is it useful as we are jQuery-based in all cases)

*/
;(function(d){
    // the topic/subscription hash
    var cache = {};

    // Publish some data on a named topic.
    d.publish = function(/* String */topic, /* Array? */args){
        console.log( cache );
        cache[topic] && d.each(cache[topic], function(){
            try {
                this.apply(d, args || []);
            } catch(err) {
                console.log(err);
            }
        });
    };

    // Register a callback on a named topic.
    d.subscribe = function(/* String */topic, /* Function */callback){
        if(!cache[topic]){
            cache[topic] = [];
        }
        cache[topic].push(callback);
        return [topic, callback]; // Array
    };

    // Disconnect a subscribed function for a topic.
    d.unsubscribe = function(/* String */topic, /* Function */callback){
        cache[topic] && d.each(cache[topic], function(idx){
            if(this == callback){
                cache[topic].splice(idx, 1);
            }
        });
    };

    // List Subscribers
    d.subscribers = function(/* String */topic) {
        l = [];
        cache[topic] && d.each(cache[topic], function(idx){
            l.push(this.name);
        });
        return l;
    };

})(jQuery);
