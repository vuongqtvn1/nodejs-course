import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { HttpResponse } from "~/utils/http-response";
import { CreateFileDTO, CreateFolderDTO, FileFilters } from "../dtos/file.dto";
import { getFilePath, tryParseJson } from "~/utils/helper";
import { EFileType } from "../models/file.model";
import { FileService } from "../services/file.service";
import { ConfigEnvironment } from "~/config/env";

export class FileController {
  static async getAllFile(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = tryParseJson(req.query.filters) as FileFilters;

      const files = await FileService.getList(filters);
      res.json(HttpResponse.get({ data: files }));
    } catch (error) {
      next(error);
    }
  }

  static async createFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { folder, name } = req.body as CreateFolderDTO;

      const data: CreateFileDTO = {
        name: name,
        url: getFilePath(ConfigEnvironment.uploadFolder, name),
        size: 0,
        format: "folder",
        type: EFileType.Folder,
        folder,
      };

      const file = FileService.createFolder(data);

      res
        .status(StatusCodes.CREATED)
        .json(HttpResponse.created({ data: file }));
    } catch (error) {
      next(error);
    }
  }

  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const directory = req.headers["directory"] as string;

      if (!req.file) {
        throw HttpResponse.notFound("No file uploaded");
      }

      const folder = req.body.folder;

      const data: CreateFileDTO = {
        name: req.file.originalname,
        url: getFilePath(directory, req.file.filename),
        size: req.file.size,
        format: req.file.mimetype,
        type: EFileType.File,
        folder,
      };

      const file = FileService.createFile(data);

      res
        .status(StatusCodes.CREATED)
        .json(HttpResponse.created({ data: file }));
    } catch (error) {
      next(error);
    }
  }

  static async renameFile(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.params.type as EFileType;
      const fileId = req.params.id as string;
      const newName = req.body.name;

      const file = FileService.renameFile({
        type,
        fileId,
        newName,
      });

      res.status(StatusCodes.OK).json(HttpResponse.get({ data: file }));
    } catch (error) {
      next(error);
    }
  }

  static async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.params.type as EFileType;
      const fileId = req.params.id as string;

      switch (type) {
        case EFileType.File:
          await FileService.deleteFile(fileId);
          break;
        case EFileType.Folder:
          await FileService.deleteFolder(fileId);
          break;
        default:
          throw HttpResponse.error({ message: "Type is not valid" });
      }

      res.status(StatusCodes.OK).json();
    } catch (error) {
      next(error);
    }
  }

  static async downloadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const fileId = req.params.id;

      const filePath = await FileService.getPathFileById(fileId);

      res.download(filePath);
    } catch (error) {
      next(error);
    }
  }
}
