import * as Yup from 'yup';

const EMAIL_DOMAINS = ['@svp.edu.in', '@gmail.com'];
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
const PASSWORD_MESSAGE =
  'Password must be 8-16 characters with an uppercase, lowercase, number, and special character(@$!%*?&)';

//**login schema */

export const loginSchema = Yup.object().shape({
  svpEmail: Yup.string()
    .required('SVP Email is required')
    .email('Please enter a valid email address')
    .test('valid-email-format', 'Invalid email format', value => {
      if (!value) return false;

      // Complex email validation regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      // Additional checks for complex email scenarios
      const complexChecks = [
        // Disallow consecutive dots
        !value.includes('..'),
        // Disallow starting or ending with a dot
        !value.startsWith('.') && !value.endsWith('.'),
        // Ensure domain has at least two characters
        value.split('.').some(part => part.length >= 2),
      ];

      return (
        emailRegex.test(value) &&
        complexChecks.every(Boolean) &&
        EMAIL_DOMAINS.some(domain => value.endsWith(domain))
      );
    })
    .max(254, 'Email address is too long'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be at most 16 characters long'),
});

//!

//**register anchal pramukh */

export const registerAnchalPramukhSchema = Yup.object().shape({
  createdFromKifId: Yup.string().required('Anchal Pramukh Name is required'),
  svpEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('SVP Email is required')
    .test(
      'valid-domain',
      'Email must end with an approved domain like @svp.edu.in and @gmail.com',
      value => {
        if (!value) return false;
        const EMAIL_DOMAINS = ['@svp.edu.in', '@gmail.com'];
        return EMAIL_DOMAINS.some(domain => value.endsWith(domain));
      },
    ),
  anchalAreaId: Yup.string().required('Anchal Area Name is required'),
});

export const registerSankulPramukhSchema = Yup.object().shape({
  createdFromKifId: Yup.string().required('Sankul Pramukh Name is required'),
  svpEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('SVP Email is required')
    .test(
      'valid-domain',
      'Email must end with an approved domain like @svp.edu.in and @gmail.com',
      value => {
        if (!value) return false;
        const EMAIL_DOMAINS = ['@svp.edu.in', '@gmail.com'];
        return EMAIL_DOMAINS.some(domain => value.endsWith(domain));
      },
    ),
  sankulAreaId: Yup.string().required('Sankul Area Name is required'),
});
export const registerSanchPramukhSchema = Yup.object().shape({
  createdFromKifId: Yup.string().required('Sanch Pramukh Name is required'),
  svpEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('SVP Email is required')
    .test(
      'valid-domain',
      'Email must end with an approved domain like @svp.edu.in and @gmail.com',
      value => {
        if (!value) return false;
        const EMAIL_DOMAINS = ['@svp.edu.in', '@gmail.com'];
        return EMAIL_DOMAINS.some(domain => value.endsWith(domain));
      },
    ),
  sanchAreaId: Yup.string().required('Sanch Area Name is required'),
});
export const registerUpsanchPramukhSchema = Yup.object().shape({
  createdFromKifId: Yup.string().required('Up Sanch Pramukh Name is required'),
  svpEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('SVP Email is required')
    .test(
      'valid-domain',
      'Email must end with an approved domain like @svp.edu.in and @gmail.com',
      value => {
        if (!value) return false;
        const EMAIL_DOMAINS = ['@svp.edu.in', '@gmail.com'];
        return EMAIL_DOMAINS.some(domain => value.endsWith(domain));
      },
    ),
  upSanchAreaId: Yup.string().required('Upsanch Area Name is required'),
});

//**change password */
export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be less than or equal to 16 characters'),

  newPassword: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be at most 16 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
      'Password must include uppercase, lowercase, number, and special character',
    )
    .test('no-common-passwords', 'Password is too common', value => {
      const commonPasswords = [
        'password',
        '123456',
        'qwerty',
        'admin',
        'letmein',
        'welcome',
        'monkey',
        'abc123',
      ];
      return !commonPasswords.includes(value.toLowerCase());
    }),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

//**reset password */
export const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .length(6, 'OTP must be 6 digit long')
    .matches(/^\d+$/, 'OTP must contain only numbers'),

  newPassword: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be at most 16 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
      'Password must include uppercase, lowercase, number, and special character',
    )
    .test('no-common-passwords', 'Password is too common', value => {
      const commonPasswords = [
        'password',
        '123456',
        'qwerty',
        'admin',
        'letmein',
        'welcome',
        'monkey',
        'abc123',
      ];
      return !commonPasswords.includes(value.toLowerCase());
    }),

  confirmPassword: Yup.string()
    .required('Confirm new password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

//**forgot password */
export const forgotPasswordSchema = Yup.object().shape({
  svpEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .test('valid-domain', 'Email must end with an approved domain', value => {
      if (!value) return false;
      const EMAIL_DOMAINS = ['@svp.edu.in', '@gmail.com'];
      return EMAIL_DOMAINS.some(domain => value.endsWith(domain));
    }),
});

//**resend otp */
export const resendOtpSchema = Yup.object().shape({
  svpEmail: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .test('valid-domain', 'Email must end with an approved domain', value => {
      if (!value) return false;
      const EMAIL_DOMAINS = ['@svp.edu.in', '@gmail.com'];
      return EMAIL_DOMAINS.some(domain => value.endsWith(domain));
    }),
});

export const anchalAreaAllocationSchema = Yup.object().shape({
  anchalName: Yup.string()
    .matches(
      /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/,
      'Each word must start with a capital letter, and no numbers are allowed',
    )
    .required('Anchal Name is required')
    .min(3, 'Anchal Name must have at least 3 characters')
    .max(50, 'Anchal Name cannot exceed 50 characters'),
  selectedZone: Yup.object().nullable().required('Zone is required'),
  selectedStates: Yup.array()
    .min(1, 'At least one State must be selected')
    .required('States are required'),
  selectedDistricts: Yup.array()
    .min(1, 'At least one District must be selected')
    .required('Districts are required'),
  selectedSubDistricts: Yup.array()
    .min(1, 'At least one Sub-District must be selected')
    .required('Sub-Districts are required'),
  selectedVillages: Yup.array()
    .min(1, 'At least one Village must be selected')
    .required('Villages are required'),
});

export const sankulAreaAllocationSchema = Yup.object().shape({
  selectedAnchal: Yup.object().required('Anchal Name is required'),
  sankulName: Yup.string()
    .matches(
      /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/,
      'Each word must start with a capital letter, and no numbers are allowed',
    )
    .required('Sankul Name is required')
    .min(3, 'Sankul Name must have at least 3 characters')
    .max(50, 'Sankul Name cannot exceed 50 characters')
    .test(
      'not-same-as-anchal',
      'Sankul Name cannot be the same as selected Anchal Name',
      function (value) {
        const anchalName = this.parent.selectedAnchal?.value;
        if (!value || !anchalName) return true;

        const normalizedSankul = value.toLowerCase().trim();
        const normalizedAnchal = anchalName.toLowerCase().trim();

        return normalizedSankul !== normalizedAnchal;
      },
    ),
  selectedZone: Yup.object().nullable().required('Zone is required'),
  selectedStates: Yup.array()
    .min(1, 'At least one State must be selected')
    .required('States are required'),
  selectedDistricts: Yup.array()
    .min(1, 'At least one District must be selected')
    .required('Districts are required'),
  selectedSubDistricts: Yup.array()
    .min(1, 'At least one Sub-District must be selected')
    .required('Sub-Districts are required'),
  selectedVillages: Yup.array()
    .min(1, 'At least one Village must be selected')
    .required('Villages are required'),
});
export const sanchAreaAllocationSchema = Yup.object().shape({
  selectedAnchal: Yup.object().required('Anchal Name is required'),
  selectedSankul: Yup.object().required('Sankul Name is required'),
  sanchName: Yup.string()
    .matches(
      /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/,
      'Each word must start with a capital letter, and no numbers are allowed',
    )
    .required('Sanch Name is required')
    .min(3, 'Sanch Name must have at least 3 characters')
    .max(50, 'Sanch Name cannot exceed 50 characters')
    .test(
      'not-same-as-anchal',
      'Sanch Name cannot be the same as selected Anchal Name',
      function (value) {
        const anchalName = this.parent.selectedAnchal?.value;
        if (!value || !anchalName) return true;

        const normalizedSanch = value.toLowerCase().trim();
        const normalizedAnchal = anchalName.toLowerCase().trim();

        return normalizedSanch !== normalizedAnchal;
      },
    )
    .test(
      'not-same-as-sankul',
      'Sanch Name cannot be the same as selected Sankul Name',
      function (value) {
        const sankulName = this.parent.selectedSankul?.value;
        if (!value || !sankulName) return true;

        const normalizedSanch = value.toLowerCase().trim();
        const normalizedSankul = sankulName.toLowerCase().trim();

        return normalizedSanch !== normalizedSankul;
      },
    ),
  selectedZone: Yup.object().nullable().required('Zone is required'),
  selectedStates: Yup.array()
    .min(1, 'At least one State must be selected')
    .required('States are required'),
  selectedDistricts: Yup.array()
    .min(1, 'At least one District must be selected')
    .required('Districts are required'),
  selectedSubDistricts: Yup.array()
    .min(1, 'At least one Sub-District must be selected')
    .required('Sub-Districts are required'),
  selectedVillages: Yup.array()
    .min(1, 'At least one Village must be selected')
    .required('Villages are required'),
});
export const UpsanchAreaAllocationSchema = Yup.object().shape({
  selectedAnchal: Yup.object().required('Anchal Name is required'),
  selectedSankul: Yup.object().required('Sankul Name is required'),
  selectedSanch: Yup.object().required('Sanch Name is required'),
  upSanchName: Yup.string()
    .matches(
      /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/,
      'Each word must start with a capital letter, and no numbers are allowed',
    )
    .required('Upsanch Name is required')
    .min(3, 'Upsanch Name must have at least 3 characters')
    .max(50, 'Upsanch Name cannot exceed 50 characters')
    .test(
      'not-same-as-anchal',
      'Upsanch Name cannot be the same as selected Anchal Name',
      function (value) {
        const anchalName = this.parent.selectedAnchal?.value;
        if (!value || !anchalName) return true;

        const normalizedUpsanch = value.toLowerCase().trim();
        const normalizedAnchal = anchalName.toLowerCase().trim();

        return normalizedUpsanch !== normalizedAnchal;
      },
    )
    .test(
      'not-same-as-sankul',
      'Upsanch Name cannot be the same as selected Sankul Name',
      function (value) {
        const sankulName = this.parent.selectedSankul?.value;
        if (!value || !sankulName) return true;

        const normalizedUpsanch = value.toLowerCase().trim();
        const normalizedSankul = sankulName.toLowerCase().trim();

        return normalizedUpsanch !== normalizedSankul;
      },
    )
    .test(
      'not-same-as-sanch',
      'Upsanch Name cannot be the same as selected Sanch Name',
      function (value) {
        const sankulName = this.parent.selectedSanch?.value;
        if (!value || !sankulName) return true;

        const normalizedUpsanch = value.toLowerCase().trim();
        const normalizedSanch = sankulName.toLowerCase().trim();

        return normalizedUpsanch !== normalizedSanch;
      },
    ),
  selectedZone: Yup.object().nullable().required('Zone is required'),
  selectedStates: Yup.array()
    .min(1, 'At least one State must be selected')
    .required('States are required'),
  selectedDistricts: Yup.array()
    .min(1, 'At least one District must be selected')
    .required('Districts are required'),
  selectedSubDistricts: Yup.array()
    .min(1, 'At least one Sub-District must be selected')
    .required('Sub-Districts are required'),
  selectedVillages: Yup.array()
    .min(1, 'At least one Village must be selected')
    .required('Villages are required'),
});
