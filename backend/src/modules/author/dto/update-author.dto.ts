import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsString()
  public bio?: string;

  @IsOptional()
  @IsUrl()
  public photo?: string;
}
