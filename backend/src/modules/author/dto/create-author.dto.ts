import { IsString, IsOptional } from 'class-validator';

/**
 * DTO pour la création d'un auteur.
 * Contient les informations nécessaires pour ajouter un nouvel auteur à la base de données.
 */
export class CreateAuthorDto {
  /** Nom de l'auteur */
  @IsString()
  public name: string;

  /** Biographie de l'auteur, optionnelle */
  @IsOptional()
  @IsString()
  public bio?: string;

  /** Lien vers la photo de l'auteur, optionnelle */
  @IsOptional()
  @IsString()
  public photo?: string;
}
