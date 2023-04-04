import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class HttpCustomService {
  constructor(private readonly httpService: HttpService) {}

  public async apiFindAll() {
    /* const response = await this.httpService
      .get('https://rickandmortiapi.com/api/character')
      .subscribe((response) => response.data); */

    try {
      const response = await firstValueFrom(
        this.httpService.get('https://rickandmortyapi.com/api/character'),
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
