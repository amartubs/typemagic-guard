
import { loginOperations } from './loginService';
import { registrationOperations } from './registrationService';
import { passwordOperations } from './passwordService';
import { socialAuthOperations } from './socialAuthService';
import { profileOperations } from './profileService';

export const authOperations = {
  ...loginOperations,
  ...registrationOperations,
  ...passwordOperations,
  ...socialAuthOperations,
  ...profileOperations
};
