Tasks = new Mongo.Collection('tasks');
Orders = new Mongo.Collection('orders');
Dishes = new Mongo.Collection('dishes');
Schedules = new Mongo.Collection('schedules');
Contacts = new Mongo.Collection('contacts');

if (Meteor.isClient) {
  // This code is executed on the client only
 

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Meteor.subscribe('tasks');
  Meteor.subscribe('orders');
  Meteor.subscribe('dishes');
  Meteor.subscribe('contacts');
  Meteor.subscribe('schedules');

  Meteor.startup(function () {
    ReactDOM.render(<Routes />, document.getElementById('root'));
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //declare email settings
    process.env.MAIL_URL = 'smtp://panorigin.prjs%40gmail.com:Pan0rigin+@smtp.gmail.com:587/';
  });

  Meteor.publish('orders', function(filter) {
    var self = this,
        ready = false;

    var subHandle = Orders.find(filter || {}).observeChanges({
      added: function (id, fields) {
        if (!ready)
          fields.existing = true;
        self.added("orders", id, fields);
      },
      changed: function(id, fields) {
        self.changed("orders", id, fields);
      },
      removed: function (id) {
        self.removed("orders", id);
      }
    });

    self.ready();
    ready = true;

    self.onStop(function () {
      subHandle.stop();
    });
  });

  Meteor.publish("dishes", function () {
    return Dishes.find({});
  });

  Meteor.publish('contacts', function() {
    return Contacts.find({});
  });

  Meteor.publish('schedules', function() {
    return Schedules.find({});
  });

  // 
  // 
  // 
  // Only publish tasks that are public or belong to the current user
  // Meteor.publish("tasks", function () {
  //   return Tasks.find({
  //     $or: [
  //       { private: {$ne: true} },
  //       { owner: this.userId }
  //     ]
  //   });
  // });

  // Meteor.publish('todos', function(listId) {
  //   // check(listId, String);

  //   return Todos.find({listId: listId});
  // }, {
  //   url: "/publications/todos/:0"
  // });

  let initializing = true;
  Orders.find().observeChanges({
    added: function (id, fields) {
      if (!initializing) {
        let contact = Contacts.findOne({owner: fields.owner});
        
        const myOrder = Meteor.absoluteUrl() + 'myorder';
        let orderDetail = '<div><p>订单如下：</p><ul>';
        Object.keys(fields.items).forEach((key) => {
          const item = fields.items[key];
          if (item.quantity !== 0) {
            orderDetail += '<li>'+item.name+' x '+item.quantity+item.unit+'</li>'
          }
        });
        orderDetail += '</ul>';
        orderDetail += '<p>Total Price: $'+fields.totalPrice+'</p>';
        orderDetail += '</div>';

        let emailContent = '<div><p>某某人已下单!</p></div>';
        emailContent += orderDetail;
        emailContent += '<div><a href="'+myOrder+'">去订单页面</a></div>';
        
        Meteor.call('sendSMS', fields.customer.phone, fields.totalPrice, false, contact);
        Meteor.call('sendEmail',
                  contact.email,
                  'panorigin.prjs@gmail.com',
                  'panorigin.prjs@gmail.com',
                  '下单',
                  emailContent);
      }
    }
  });
  initializing = false;

  Meteor.methods({
    sendSMS(phone, price, customer, contacts) {
      const accountSid = 'AC78613017db5b491563d248932c405ba6';
      const authToken = 'e23740731e740dac8c1fb2b5b2645a90';

      twilio = Twilio(accountSid, authToken); //this appears to be the issue

      let to = '';
      let body = '';
      if (customer) {
        if (phone.match(/^\+86/)) {
          to = phone;
        } else {
          to = '+1'+phone;
        }
        body = '你好，我们已经开始处理您的订单!';
      } else {
        to = contacts.phone;
        body = `您有新的订单: 电话: ${phone} 金额: $${price}`;
      }
      console.log(to);
      console.log(body);

      twilio.sendSms({
        to:to, 
        from: '+16136931086', 
        body: body
      }, function(err, responseData) { 
        if (!err) { 
          console.log(err)
        }
      });
    },

    sendEmail(to, from, cc, subject, text) {
      check([to, from, subject, text], [String]);

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      Email.send({
        to: to,
        from: from,
        cc: cc,
        subject: subject,
        html: text
      });
    }
  });
}

Meteor.methods({
  getDishes(owner) {
    const dishes = Dishes.find({owner: owner}).fetch();
    return dishes;
  },

  getContacts(owner) {
    const contacts = Contacts.find({owner: owner}).fetch();
    return contacts;
  },

  getSchedule(owner) {
    const schedules = Schedules.find({owner: owner}).fetch();
    return schedules;
  },

  getPeriodOrderCount(owner, from, to) {
    const today = new Date(from.toLocaleDateString());
    const startOfTo = new Date(to.toLocaleDateString());
    const tomorrowOfTO = new Date(startOfTo.getTime() + 60 * 60 * 24 * 1000);

    // console.log(today);
    // console.log(startOfTo);
    // console.log(tomorrowOfTO);
    const orderCount = Orders.find({
      createdAt: {
        $gte: today,
        $lt: tomorrowOfTO
      },
      owner: owner
    }).count();
    // console.log(orderCount);
    return orderCount;
  },

  getOrderCount(owner) {
    const orderCount = Orders.find({owner: owner}).count();
    return orderCount;
  },

  addOrder(order) {
    order.createdAt = new Date();
    order.received = true;
    order.dispatched = false;
    order.completed = false;

    Meteor.call('getOrderCount', order.owner, (error, result) => {
      // console.log(result);
      order.orderNumber = result + 1;
      Orders.insert(order);
    });
  },

  completeOrder(orderID) {
    const order = Orders.findOne(orderID);
    Orders.update(orderID, { $set: { completed: true, completedAt: new Date()} });
  },

  setDispatched(orderID, value) {
    const order = Orders.findOne(orderID);
    Orders.update(orderID, { $set: { dispatched: value} });
  },

  addDish(dish) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Dishes.insert(dish);
  },

  deleteDish(dishID) {
    const dish = Dishes.findOne(dishID);
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Dishes.remove(dishID);
  },

  addSchedule(schedule, owner) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    let ownerSchedule = Schedules.findOne({owner: owner});

    if (ownerSchedule) {
      Schedules.update({owner: owner}, {$addToSet: {schedule: schedule}});
    } else {
      let item = {};
      item.owner = owner;
      item.schedule = [schedule];
      
      Schedules.insert(item);
    }
  },

  deleteSchedule(schedule, owner) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Schedules.update({owner: owner}, {$pull: {schedule: schedule}});
  },

  // getOrders(owner) {
  //   const orders = Orders.find({owner: owner}).fetch();
  //   return orders;
  // },

  // getAllRecords(username) {
  //   const tasks = Tasks.find({username: username}).fetch();
  //   return tasks;
  // },

  addTaskREST(req) {
    Tasks.insert({
      text: req.text,
      createdAt: new Date(),
      owner: req.owner,
      username: req.username
    });
  },

  addTask(text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
 
  removeTask(taskId) {
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },
 
  setChecked(taskId, setChecked) {
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate(taskId, setToPrivate) {
    const task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },

  setProfileInfo(contactID, contact, dishIDs, dish, scheduleID, schedule) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    
    //update the Contacts collection record
    Contacts.update(contactID, {$set: contact});

    //update the Dished collection records
    dishIDs.forEach((dishID, index) => {
      Dishes.update(dishID, {$set: dish[index]});
    });

    //update the Schedules collection records
    Schedules.update(scheduleID, {$set: {schedule: schedule}});
  }
});