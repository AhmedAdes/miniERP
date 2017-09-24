import {Injectable} from '@angular/core'

@Injectable()
export class BaMsgCenterService {

  private _notifications = [
    // {
    //   name: 'Kostya',
    //   text: 'Kostya invited you to join the event.',
    //   time: '1 week ago'
    // }
  ];

  private _messages = [
    // {
    //   name: 'Vlad',
    //   text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
    //   time: '1 week ago'
    // }
  ];

  public getMessages():Array<Object> {
    return this._messages;
  }

  public getNotifications():Array<Object> {
    return this._notifications;
  }
}
