import { Request, Response } from 'express';
import { CertificateService } from '../services/certificate.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

export const issueCertificate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const certificate = await CertificateService.generateCertificate(
    req.user._id.toString(),
    req.params.courseId
  );

  res
    .status(201)
    .json(new ApiResponse(201, certificate, 'Certificate generated successfully'));
});

export const getCertificateByCredential = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const certificate = await CertificateService.getCertificateByCredentialId(req.params.credentialId);
  if (!certificate) {
    throw new ApiError(404, 'Certificate not found with this validation code');
  }

  res
    .status(200)
    .json(new ApiResponse(200, certificate, 'Certificate validated successfully'));
});

export const getMyCertificates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Auth required');
  }

  const certificates = await CertificateService.getMyCertificates(req.user._id.toString());

  res
    .status(200)
    .json(new ApiResponse(200, certificates, 'Certificates retrieved successfully'));
});
