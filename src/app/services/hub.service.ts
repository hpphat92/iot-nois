import { Injectable } from "@angular/core";
import { HubConnection, HttpConnection, TransportType, ConsoleLogger, LogLevel } from "@aspnet/signalr-client";
import { AppSetting } from '../app.setting';

@Injectable()
export class HubService {
    private hubConnection: HubConnection;

    public getHubConnection(): HubConnection {
        let logger = new ConsoleLogger(LogLevel.Information);
        let httpConnection = new HttpConnection(`${AppSetting.HUB_ENDPOINT}/sensor-hub`, { transport: TransportType.WebSockets, logging: logger });
        this.hubConnection = new HubConnection(httpConnection);

        this.hubConnection.start().then(() => {
            console.log("Hub connection started.");
        }).catch(err => {
            console.log("Hub connection error: ", err);
        });

        this.hubConnection.onclose(err => {
            console.log("Hub connection closed.");
        })

        return this.hubConnection;
    }
}