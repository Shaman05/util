/**
 * Created by ChenChao on 2016/1/4.
 */

;(function () {
  function MyModule() {
    var util = {};

    /**
     * @function createRandom 随机数生成函数
     * @param range 指定随机数的生成范围
     * @returns {create} step 表示至少在该区域内不会重复出现相同的数字, 默认为 range
     */
    util.createRandom = function(range){
      var buffer = [];
      return function create(step){
        var num = Math.floor(Math.random() * range);
        var _step = step || range;
        if(buffer.length === _step){
          buffer.shift();
        }
        if(buffer.indexOf(num) < 0){
          buffer.push(num);
          return num;
        }
        return create();
      };
    };

    /**
     * @function eventProxy 页面事件代理
     * @param eventGroup 事件句柄的集合
     * @param options 代理器的配置
     */
    util.eventProxy = function(eventGroup, options){
      if(jQuery === undefined || Zepto === undefined){
        throw new Error('util.eventProxy require jQuery or Zepto!');
      }
      var defaultSetting = {
        prefix: 'data-event-',
        events: ['click', 'focus', 'blur', 'focusin', 'focusout', 'change', 'mouseover', 'mouseout']
      };
      var opt = $.extend(defaultSetting, options);
      var eventMap = {};
      var $doc = $(document);
      $.each(opt.events, function(index, eventName){
        var event = opt.prefix + eventName;
        eventMap[eventName] = event;
        $doc.on(eventName, '[' + event + ']', function(e){
          throwEvent.call(this, e, eventGroup);
          e.stopPropagation && e.stopPropagation();
          e.cancelBubble && (e.cancelBubble = true);
        });
      });

      function throwEvent(e, eventGroup){
        var $this = $(this);
        if(!eventGroup){
          return false;
        }
        var fn = $this.attr(eventMap[e.type]);
        var args = $this.attr('data-event-args');
        args = args && args.split(',') || [];
        eventExec.call(this, e, fn, args, eventGroup);
      }

      function eventExec(e, fn, args, eventGroup){
        var group;
        var _args = [e].concat(args);
        if(typeof eventGroup[fn] === 'function'){
          eventGroup[fn].apply(this, _args);
        }else{
          group = fn.split('.');
          if(eventGroup[group[0]] && typeof eventGroup[group[0]][group[1]] == 'function'){
            eventGroup[group[0]][group[1]].apply(this, _args);
          }
        }
      }
    };
  }

  var moduleName = MyModule;
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = moduleName;
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(function () {
      return moduleName;
    });
  } else {
    this.moduleName = moduleName;
  }
}).call(function () {
  return this || (typeof window !== 'undefined' ? window : global);
});