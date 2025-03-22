import { IsString, IsInt, IsOptional, IsNumber } from 'class-validator';

/**
 * DTO pour la création d'un livre.
 * Contient les informations nécessaires pour ajouter un nouveau livre à la base de données.
 */
export class CreateBookDto {
  /** Le titre du livre */
  @IsString()
  public title: string;

  /** Année de publication du livre */
  @IsInt()
  public publicationYear: number;

  /** Identifiant de l'auteur du livre */
  @IsString()
  public authorId: string;

  /** Prix du livre, optionnel */
  @IsOptional()
  @IsNumber()
  public price?: number;
}
