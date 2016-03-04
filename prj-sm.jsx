Tasks = new Mongo.Collection('tasks');
Orders = new Mongo.Collection('orders');
Dishes = new Mongo.Collection('dishes');

if (Meteor.isClient) {
  // This code is executed on the client only
 

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Meteor.subscribe('tasks');
  Meteor.subscribe('orders');
  Meteor.subscribe('dishes');

  Meteor.startup(function () {
    ReactDOM.render(<Routes />, document.body);
  });
}

if (Meteor.isServer) {


  Meteor.publish("orders", function () {
    return Orders.find({});
  });

  Meteor.publish("dishes", function () {
    return Dishes.find({});
  });

  // 
  // 
  // 
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

  Meteor.publish('todos', function(listId) {
    // check(listId, String);

    return Todos.find({listId: listId});
  }, {
    url: "/publications/todos/:0"
  });
}

Meteor.methods({

  getDishes(owner) {
    const dishes = Dishes.find({owner: owner}).fetch();
    return dishes;
  },

  addOrder(order) {
    order.createdAt = new Date();
    order.received = true;
    order.dispatched = false;
    order.completed = false;

    Orders.insert(order);
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
  }
});