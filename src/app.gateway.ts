import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './integrations/socket/socket.service';
import { Logger } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: SocketService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;
  private clients: Map<string, Socket> = new Map();
  private readonly logger: Logger = new Logger(Gateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    this.socketService.socket = server;
  }

  @SubscribeMessage('auth')
  sendMessageToHawkArm(client: Socket, jwtToken: string): void {
    this.authService.authSocketClient(jwtToken, client.id);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }
}
