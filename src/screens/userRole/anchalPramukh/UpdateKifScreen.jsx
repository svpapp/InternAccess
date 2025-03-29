import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    Button,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox'
import { Picker } from '@react-native-picker/picker';
import { FieldArray, Form, Formik } from 'formik';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import * as Yup from 'yup';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import { Pressable, ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { API_BASE_URL } from '../../../constant/Constatnt';
import { Dropdown } from 'react-native-element-dropdown';
import { getProfile } from '../../../api/auth/authService';

const UpdateKifScreen = () => {

    const [showDatePickerdate, setShowDatePicker] = useState(false);
    const [countries, setCountries] = useState([]);
    const [progress, setProgress] = useState(0);
    const [datePickerVisible, setDatePickerVisible] = useState(null); // Track which field is open
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedFamilyMemberIndex, setSelectedFamilyMemberIndex] = useState(null); // New state for family member index
    const [showpurchaseDatearrayPicker, setShowpurchaseDatearrayPicker] = useState(false);
    const [showinsuranceExpiryDatearrayPicker, setShowinsuranceExpiryDatearrayPicker] = useState(false);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [expandedSection, setExpandedSection] = useState('personaldetails'); // State to track expanded section
    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section); // Toggle section
    };
    const [selectedFiles, setSelectedFiles] = useState({
        licenseFile: null,
        noplateFile: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const totalSteps = 9;
    const [formValues, setFormValues] = useState({ initialFormValues });
    const [email, setEmail] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [graduationFields, setGraduationFields] = useState([]);
    const [postGraduationFields, setPostGraduationFields] = useState([]);
    const [diplomaFields, setDiplomaFields] = useState([]);
    const [profileData, setProfileData] = useState(null);

    const kifId = profileData?.createdFromKifId;


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { responseData } = await getProfile();
                setProfileData(responseData);
                console.log(responseData, "User Profile Data");
            } catch (error) {
                console.error('Error fetching profile data:', error);
                Alert.alert('Failed to load profile data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleNext = async (validateForm, setFieldTouched) => {
        // Trigger validation for the current step
        const errors = await validateForm();
        console.log(errors);


        // Set all fields as touched to show errors
        Object.keys(errors).forEach(field => {
            setFieldTouched(field, true);
        });

        // If there are no validation errors, move to the next step
        if (Object.keys(errors).length === 0) {
            setStep(prevStep => Math.min(prevStep + 1, totalSteps));
        }
    };

    useEffect(() => {
        if (kifId) {
            const fetchData = async () => {

                try {
                    const response = await axios.get(`${API_BASE_URL}/api/v1/userKif/${kifId}`);
                    const data = response.data;


                    if (data.state) {
                        const selectedState = states.find(s => s.StateName === data.state);
                        if (selectedState) {
                            setDistricts(
                                Array.from(new Set(selectedState.districts.map(d => d.Districtname)))
                                    .map(name => selectedState.districts.find(d => d.Districtname === name))
                            );

                            if (data.district) {
                                const selectedDistrict = selectedState.districts.find(
                                    d => d.Districtname === data.district
                                );
                                if (selectedDistrict) {
                                    setSubdistricts(
                                        Array.from(new Set(selectedDistrict.subdistricts.map(sd => sd['Sub-distname'])))
                                            .map(name => selectedDistrict.subdistricts.find(sd => sd['Sub-distname'] === name))
                                    );

                                    if (data.taluka) {
                                        const selectedTaluka = selectedDistrict.subdistricts.find(
                                            sd => sd['Sub-distname'] === data.taluka
                                        );
                                        if (selectedTaluka) {
                                            setVillages(
                                                Array.from(new Set(selectedTaluka.details.map(v => v.VillageName)))
                                                    .map(name => selectedTaluka.details.find(v => v.VillageName === name))
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Construct full image URL if photo path exists
                    const photoUrl = data.photo ? `${API_BASE_URL}/${data.photo.replace(/\\/g, '/')}` : null;

                    // Set initial form values
                    setFormValues({
                        ...data,
                        photo: photoUrl ? { uri: photoUrl } : null, // Ensure correct structure for `photo`
                    });
                    console.log('Data fetched:', response.data);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [kifId, states]);


    useEffect(() => {
        const fetchFields = async () => {
            try {
                // Fetch data for multiple fields simultaneously using Promise.all
                const [graduationResponse, postGraduationResponse, diplomaResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/v1/fields/graduation`),
                    axios.get(`${API_BASE_URL}/api/v1/fields/postgraduation`),
                    axios.get(`${API_BASE_URL}/api/v1/fields/diploma`),
                ]);

                // Set state for each field type
                setGraduationFields(graduationResponse.data);
                setPostGraduationFields(postGraduationResponse.data);
                setDiplomaFields(diplomaResponse.data);



            } catch (error) {
                console.error('Error fetching fields:', error);
            }
        };

        fetchFields();
    }, []);

    const handlePrevious = () => {
        setStep(prevStep => Math.max(prevStep - 1, 1));
    };

    useEffect(() => {
        const fetchStates = async () => {

            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/zoneArea/testAreaRouter/get-zone-json`)
                // console.log("Response received:", response); // Log the entire response

                const zones = response.data;
                // console.log('zones:', zones);

                const allStates = zones.flatMap(zone => zone.states); // Use flatMap for nested arrays
                setStates(allStates);
                // console.log('allStates:', allStates);

            } catch (error) {
                console.error("Error occurred while fetching states:", error); // Log the error object

                if (error.response) {
                    // Server responded with a status code outside the 2xx range
                    console.error("Server responded with an error:", error.response);
                    console.log("Error status:", error.response.status); // Log the status code
                    console.log("Error data:", error.response.data); // Log the error data
                } else if (error.request) {
                    // Request was made but no response was received
                    console.error("No response received:", error.request);
                    alert("Unable to connect to the server. Please check your network.");
                } else {
                    // Something else happened
                    console.error("Error fetching states:", error.message);
                }

                // Optionally set default states or handle the error gracefully
                setStates([]);
            }
        };

        fetchStates();
    }, []);


    const handleStateChange = (value, setFieldValue) => {
        setFieldValue("state", value);
        setFieldValue("district", "");
        setFieldValue("taluka", "");
        setFieldValue("village", "");
        setFieldValue("pincode", "");

        const selectedState = states.find(s => s.StateName === value);
        if (selectedState) {
            const uniqueDistricts = Array.from(new Set(selectedState.districts.map(d => d.Districtname)))
                .map(districtName => selectedState.districts.find(d => d.Districtname === districtName));
            setDistricts(uniqueDistricts);
        } else {
            setDistricts([]);
        }
    };

    const handleDistrictChange = (value, setFieldValue) => {
        setFieldValue("district", value);
        setFieldValue("taluka", "");
        setFieldValue("village", "");
        setFieldValue("pincode", "");

        const selectedDistrict = districts.find(d => d.Districtname === value);
        if (selectedDistrict) {
            const uniqueSubdistricts = Array.from(new Set(selectedDistrict.subdistricts.map(sd => sd['Sub-distname'])))
                .map(talukaName => selectedDistrict.subdistricts.find(sd => sd['Sub-distname'] === talukaName));
            setSubdistricts(uniqueSubdistricts);
        } else {
            setSubdistricts([]);
        }
    };

    const handleSubdistrictChange = (value, setFieldValue) => {
        setFieldValue("taluka", value);
        setFieldValue("village", "");
        setFieldValue("pincode", "");

        const selectedSubdistrict = subdistricts.find(sd => sd['Sub-distname'] === value);
        if (selectedSubdistrict) {
            const uniqueVillages = Array.from(new Set(selectedSubdistrict.details.map(v => v.VillageName)))
                .map(villageName => selectedSubdistrict.details.find(v => v.VillageName === villageName));
            setVillages(uniqueVillages);
        } else {
            setVillages([]);
        }
    };

    const handleVillageChange = (value, setFieldValue) => {
        const selectedVillage = villages.find(v => v.VillageName === value);
        setFieldValue("village", value);
        setFieldValue("pincode", selectedVillage ? selectedVillage.Pincode : "");
    };


    const calculateProgress = (values) => {
        const totalFields = [
            'firstName',
            'middleName',
            'lastName',
            'fathersFirstName',
            'fathersMiddleName',
            'fathersLastName',
            'mothersFirstName',
            'mothersMiddleName',
            'mothersLastName',
            'gender',
            ...(values.gender === 'other' ? ['customGender'] : []),
            'dateOfBirth',
            'religion',
            ...(values.religion === 'other' ? ['customReligion'] : []),
            'bloodGroup',
            'nationality',
            'photo',
            // Family details
            'isMarried',
            ...(values.isMarried === 'yes'
                ? ['spouseFirstName', 'spouseMiddleName', 'spouseLastName', 'marriageDate']
                : []),
            'isSVPParticipant',
            ...(values.isSVPParticipant === 'yes'
                ? ['svpDesignation', 'svpDateOfJoining', 'svpLocation']
                : []),
            ...(Array.isArray(values.otherFamilyMembers)
                ? values.otherFamilyMembers.reduce(
                    (acc, member, index) => [
                        ...acc,
                        `otherFamilyMembers[${index}].name`,
                        `otherFamilyMembers[${index}].dob`,
                        `otherFamilyMembers[${index}].relationToRelativearray`,
                    ],
                    [],
                )
                : []),
            'schoolEducation',
            ...(values.schoolEducation === '9th to 12th' ? ['standard'] : []),
            ...(values.schoolEducation === 'Graduation' ? ['graduationField'] : []),
            ...(values.schoolEducation === 'PostGraduation' ? ['postGraduationField'] : []),
            ...(values.schoolEducation === 'Diploma' ? ['diplomaField'] : []),
            'otherSkills',
            'languages',
            'certification',
            ...(values.certification === 'yes' ? ['certificationFile'] : []),
            'state',
            'district',
            'taluka',
            'village',
            'pincode',
            'houseAddress',
            'landmark',
            'gramPanchayat',
            'primaryMobilerelationToRelativearray',
            'countryCode',
            'primaryMobileNumber',
            'familyMobileNumber',
            'familyrelationToRelativearray',
            'otherFamilyrelationToRelativearray',
            'isWhatsappNumber',
            'secondaryMobile',
            'emergencyContact',
            'emergencyrelationToRelativearray',
            'otherEmergencyrelationToRelativearray',
            'hasPAN',
            ...(values.hasPAN === 'yes' ? ['panNumber', 'panName'] : []),
            'hasAadhar',
            ...(values.hasAadhar === 'yes' ? ['aadharNumber', 'aadharName'] : []),
            'hasDrivingLicense',
            ...(values.hasDrivingLicense === 'yes'
                ? ['licenseNumber', 'licenseName', 'licenseFile']
                : []),
            'hasAyushmanCard',
            ...(values.hasAyushmanCard === 'yes' ? ['ayushmanNumber'] : []),
            'abhaAddress',
            'hasPMJAY',
            'position',
            ...(values.position === 'other' ? ['customposition'] : []),
            'isBachatGatMember',
            ...(values.isBachatGatMember === 'yes'
                ? ['bachatGatGroupName', 'bachatGatNumberOfPeople', 'bachatGatWorkDetails']
                : []),
            'isKrushiGroupMember',
            ...(values.isKrushiGroupMember === 'yes'
                ? ['krushiGroupName', 'krushiGroupNumberOfPeople', 'krushiGroupWorkDetails']
                : []),
            'otherIncomeSource',
            'bankName',
            'nameOnBankAccount',
            'ifscCode',
            'bankBranch',
            'ownVehicle',
            ...(values.ownVehicle === 'yes' ? ['vehicles'] : []),
        ];

        const filledFields = totalFields.filter((field) => {
            const value = values[field];
            return value !== undefined && value !== null && value !== ''; // Check for non-empty values
        }).length;

        return Math.round((filledFields / totalFields.length) * 100);
    };


    const validationSchema = [
        Yup.object().shape({
            firstName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'First name can only contain letters and spaces'
                )
                .required('First Name is required'),
            middleName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Middle name can only contain letters and spaces'
                )
                .required('Middle Name is required'),
            lastName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Last name can only contain letters and spaces'
                )
                .required('Last Name is required'),
            fathersFirstName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Father First Name can only contain letters and spaces'
                )
                .required('Father First Name is required'),
            fathersMiddleName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Father Middle Name can only contain letters and spaces'
                )
                .required('Father Middle Name is required'),
            fathersLastName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Father Last Name can only contain letters and spaces'
                )
                .required('Father Last Name is required'),
            mothersFirstName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Mother First Name can only contain letters and spaces'
                )
                .required('Mother First Name is required'),
            mothersMiddleName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Mother Middle Name can only contain letters and spaces'
                )
                .required('Father Middle Name is required'),
            mothersLastName: Yup.string()
                .matches(
                    /^[A-Za-z ]*$/,
                    'Mother Last Name can only contain letters and spaces'
                )
                .required('Father Last Name is required'),
            gender: Yup.string().required('Gender is required'),
            customGender: Yup.string().when('gender', {
                is: 'other', // Only apply validation if 'gender' is 'other'
                then: () => Yup.string().required('Custom Gender is required'),
                otherwise: () => Yup.string().notRequired(),
            }),

            religion: Yup.string().required('Religion is required'),
            customReligion: Yup.string().when('religion', {
                is: 'Other', // Only apply validation if 'religion' is 'other'
                then: () => Yup.string().required('Custom Religion is required'),
                otherwise: () => Yup.string().notRequired(),
            }),
            bloodGroup: Yup.string().required('Blood group is required'),
            nationality: Yup.string().required('Nationality is required'),
            photo: Yup.object({

                uri: Yup.string().required('Photo URI is required')
                    .matches(
                        /\.(jpg|jpeg|png)$/i, // Allow only .jpg, .jpeg, .png extensions
                        'Photo must be in JPG, JPEG, or PNG format'
                    )
            }).required('Photo is required'),
            dateOfBirth: Yup.string().required('Date of Birth is required'),
        }),
        Yup.object().shape({
            isMarried: Yup.string().required('isMarried status is required'),
            spouseFirstName: Yup.string()

                .when('isMarried', {
                    is: 'yes',
                    then: () => Yup.string().required('Spouse Name is required')
                        .matches(
                            /^[A-Za-z ]*$/,
                            'First name can only contain letters and spaces'
                        ),
                    otherwise: () => Yup.string(),
                }),
            spouseMiddleName: Yup.string()
                .when('isMarried', {
                    is: 'yes',
                    then: () => Yup.string().required('Spouse Middle Name is required')
                        .matches(
                            /^[A-Za-z ]*$/,
                            'First name can only contain letters and spaces'
                        ),
                    otherwise: () => Yup.string(),
                }),
            spouseLastName: Yup.string()
                .when('isMarried', {
                    is: 'yes',
                    then: () => Yup.string().required('Spouse Last Name is required')
                        .matches(
                            /^[A-Za-z ]*$/,
                            'First name can only contain letters and spaces'
                        ),
                    otherwise: () => Yup.string(),
                }),
            marriageDate: Yup.date()
                .nullable()
                .when('isMarried', {
                    is: 'yes',
                    then: () => Yup.date().required('Marriage Date is required').nullable(),
                    otherwise: () => Yup.date().nullable(),
                }),
            isSVPParticipant: Yup.string()
                .when('isMarried', {
                    is: 'yes',
                    then: () => Yup.string().required('SVP Participant status is required'),
                    otherwise: () => Yup.string(),
                }),
            svpDesignation: Yup.string()
                .when('isSVPParticipant', {
                    is: 'yes',
                    then: () => Yup.string().required('SVP Designation is required'),
                    otherwise: () => Yup.string(),
                }),
            svpDateOfJoining: Yup.date()
                .nullable()
                .when('isSVPParticipant', {
                    is: 'yes',
                    then: () => Yup.date().required('Date of Joining is required').nullable(),
                    otherwise: () => Yup.date().nullable(),
                }),
            svpLocation: Yup.string()
                .when('isSVPParticipant', {
                    is: 'yes',
                    then: () => Yup.string().required('svpLocation is required'),
                    otherwise: () => Yup.string(),
                }),
            otherFamilyMembers: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string().required('Family Member Name is required'),
                    dob: Yup.date()
                        .nullable()
                        .required('Date of Birth is required'),
                    relation: Yup.string().required('relationToRelativearray is required'),
                }),
            ),
        }),
        Yup.object().shape({
            schoolEducation: Yup.string().required('Education level is required'),
            standard: Yup.string().when('schoolEducation', {
                is: '9th to 12th',
                then: () => Yup.string().required('Standard is required'),
            }),
            graduationField: Yup.string().when('schoolEducation', {
                is: 'Graduation',
                then: () => Yup.string().required('Graduation field is required'),
            }),
            postGraduationField: Yup.string().when('schoolEducation', {
                is: 'PostGraduation',
                then: () => Yup.string().required('PostGraduation field is required'),
            }),
            diplomaField: Yup.string().when('schoolEducation', {
                is: 'Diploma',
                then: () => Yup.string().required('Diploma field is required'),
            }),

            languages: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string().required('Language name is required'),
                    read: Yup.boolean(),
                    write: Yup.boolean(),
                    speak: Yup.boolean(),
                    understand: Yup.boolean(),
                }),
            ),

            certification: Yup.string().required('Certification is required'),


        }),

        Yup.object().shape({
            state: Yup.string().required('State is required'),
            district: Yup.string().required('District is required'),
            taluka: Yup.string().required('Taluka is required'),
            village: Yup.string().required('Village is required'),
            houseAddress: Yup.string().required('House Address is required'),
            landmark: Yup.string().required('Landmark is required'),
            gramPanchayat: Yup.string().required('Grampanchayat is required'),
            primaryMobileNumber: Yup.string()
                .matches(/^\d{10}$/, 'Invalid phone number')
                .required('Primary Phone Number is required'),
            secondaryMobile: Yup.string()
                .matches(/^\d{10}$/, 'Invalid phone number')
                .nullable(),
            emergencyContact: Yup.string()
                .matches(/^\d{10}$/, 'Invalid phone number')
                .notOneOf(
                    [Yup.ref('primaryPhoneNumber')],
                    'Emergency contact number cannot be the same as the primary own number'
                )
                .required('Emergency Contact Number is required'),
        }),
        Yup.object().shape({
            // PAN Card Details
            hasPAN: Yup.string().required('Please select PAN Card Details'),
            panNumber: Yup.string()
                .when('hasPAN', {
                    is: 'yes',
                    then: () =>
                        Yup.string()
                            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number')
                            .required('PAN Number is required'),
                    otherwise: () => Yup.string().nullable(),
                }),
            panName: Yup.string()
                .when('hasPAN', {
                    is: 'yes',
                    then: () => Yup.string().required('Name on PAN Card is required'),
                    otherwise: () => Yup.string().nullable(),
                }),

            // Aadhar Card Details
            hasAadhar: Yup.string().required('Please select Aadhar Card Details'),
            aadharNumber: Yup.string()
                .when('hasAadhar', {
                    is: 'yes',
                    then: () =>
                        Yup.string()
                            .matches(/^\d{12}$/, 'Invalid Aadhar Number')
                            .required('Aadhar Number is required'),
                    otherwise: () => Yup.string().nullable(),
                }),
            aadharName: Yup.string()
                .when('hasAadhar', {
                    is: 'yes',
                    then: () => Yup.string().required('Name on Aadhar Card is required'),
                    otherwise: () => Yup.string().nullable(),
                }),

            // Driving License Details
            hasDrivingLicense: Yup.string().required('Please select Driving License Details'),
            licenseNumber: Yup.string()
                .when('hasDrivingLicense', {
                    is: 'yes',
                    then: () =>
                        Yup.string()
                            .matches(/^[A-Z0-9]{15}$/, 'Invalid Driving License Number')
                            .required('Driving License Number is required'),
                    otherwise: () => Yup.string().nullable(),
                }),
            licenseName: Yup.string()
                .when('hasDrivingLicense', {
                    is: 'yes',
                    then: () => Yup.string().required('Name on Driving License is required'),
                    otherwise: () => Yup.string().nullable(),
                }),
            licenseFile: Yup.mixed()
                .when('hasDrivingLicense', {
                    is: 'yes',
                    then: () =>
                        Yup.mixed()
                            .test('fileRequired', 'Driving License file is required', (value) => !!value)
                            .required(),
                    otherwise: () => Yup.mixed().nullable(),
                }),

            // Ayushman Card Details
            hasAyushmanCard: Yup.string().required('Please select Ayushman Card Details'),
            ayushmanNumber: Yup.string()
                .when('hasAyushmanCard', {
                    is: 'yes',
                    then: () => Yup.string().required('Ayushman Card Number is required'),
                    otherwise: () => Yup.string().nullable(),
                }),
            abhaAddress: Yup.string()
                .when('hasAyushmanCard', {
                    is: 'yes',
                    then: () => Yup.string().required('ABHA Address is required'),
                    otherwise: () => Yup.string().nullable(),
                }),

            // Pradhan Mantri Jan Arogya Yojna
            hasPMJAY: Yup.string().required('Please select PMJAY Details'),
        }),
        Yup.object().shape({}),
        Yup.object().shape({
            // Bank Name
            bankName: Yup.string()
                .required('Bank Name is required')
                .min(2, 'Bank Name must be at least 2 characters')
                .max(50, 'Bank Name cannot exceed 50 characters'),

            // Name on Bank Account
            nameOnBankAccount: Yup.string()
                .required('Name on Bank Account is required')
                .matches(
                    /^[a-zA-Z\s]+$/,
                    'Name on Bank Account can only contain letters and spaces',
                )
                .max(50, 'Name on Bank Account cannot exceed 50 characters'),

            // IFSC Code
            ifscCode: Yup.string()
                .required('IFSC Code is required')
                .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code'),

            // Branch Name
            bankBranch: Yup.string()
                .required('Branch Name is required')
                .min(2, 'Branch Name must be at least 2 characters')
                .max(50, 'Branch Name cannot exceed 50 characters'),
        }),
        Yup.object().shape({
            ownVehicle: Yup.string().required('This field is required'),

            vehicles: Yup.array().when('ownVehicle', {
                is: 'yes', // Only validate if hasVehicle is 'yes'
                then: () => Yup.array().of(
                    Yup.object().shape({
                        ownershipType: Yup.string().required('Ownership type is required'),
                        relation: Yup.string().when('ownershipType', {
                            is: 'relative',
                            then: () => Yup.string().required('Please specify the relation'),
                            otherwise: () => Yup.string().notRequired(),
                        }),
                        vehicleType: Yup.string().required('Vehicle type is required'),
                        purchaseDate: Yup.string().required('Purchase date is required'),
                        insurance: Yup.string().required('Insurance status is required'),
                        insuranceExpiry: Yup.string().when('insurance', {
                            is: 'yes',
                            then: () => Yup.string().required('Insurance expiry date is required'),
                            otherwise: () => Yup.string().notRequired(),
                        }),
                        odometer: Yup.string()
                            .required('Odometer reading is required')
                            .matches(/^\d+$/, 'Odometer must be a valid number'),
                    })
                ).min(1, 'At least one vehicle is required'), // Ensure that at least one vehicle is added
                otherwise: () => Yup.array().notRequired(), // If hasVehicle is not 'yes', vehicles is not required
            }),
        }),

    ];

    const stepNames = ['Personal', 'Family', 'Academic', 'Communication', 'Legal', 'Social', 'Finance', 'Conveyence', 'Preview'];

    const renderStepIndicator = () => {

        const handleStepClick = (targetStep) => {
            if (targetStep !== step) {
                setStep(targetStep); // Update the current step in your parent state
            }
        };
        const indicators = [];
        for (let i = 1; i <= totalSteps; i++) {
            indicators.push(
                <TouchableOpacity onPress={() => handleStepClick(i)} // Navigate to the clicked step
                    key={i} style={styles.stepContainer}>
                    <View style={[styles.stepIndicator, i <= step && styles.activeStep]}>
                        <Text style={[styles.stepText, i <= step && styles.activeStepText]}>
                            {i}
                        </Text>
                    </View>
                    <Text style={[styles.stepName, i === step && styles.activeStepName]}>
                        {stepNames[i - 1]}
                    </Text>
                    {i < totalSteps && (
                        <View style={[styles.line, i < step && styles.activeLine]} />
                    )}
                </TouchableOpacity>,
            );
        }
        return <ScrollView horizontal={true} contentContainerStyle={styles.indicatorContainer}>{indicators}</ScrollView>;
    };

    const handleChangeWithTouch =
        (setFieldValue, setFieldTouched) => fieldName => text => {
            setFieldValue(fieldName, text);
            setFieldTouched(fieldName, true); // Mark the field as touched
        };

    const handleDateChange = (event, selectedDate, setFieldValue) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false); // Hide the date picker after selecting a date

        // Convert date to ISO string before setting it
        setFieldValue('dateOfBirth', currentDate.toISOString());
    };

    const handleFile = async (fieldName, setFieldValue) => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
            });

            // Update Formik and local state dynamically
            setSelectedFiles((prev) => ({
                ...prev,
                [fieldName]: res[0],
            }));
            setFieldValue(fieldName, res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker');
            } else {
                console.error('File selection error:', err);
            }
        }
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs access to your camera',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Camera permission granted');
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleSelfImage = (setFieldValue) => {
        Alert.alert(
            'Select Self Image',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: () => {
                        requestCameraPermission().then(() => {
                            const options = {
                                mediaType: 'photo',
                                maxWidth: 300,
                                maxHeight: 300,
                                quality: 1,
                            };
                            launchCamera(options, (response) => {

                                if (response.didCancel) {
                                    console.log('User cancelled image picker');
                                } else if (response.errorCode) {
                                    console.log('ImagePicker Error: ', response.errorMessage);
                                } else if (response.assets && response.assets.length > 0) {
                                    const file = {
                                        uri: response.assets[0].uri,
                                        type: response.assets[0].type || 'image/jpeg',
                                        fileName: response.assets[0].fileName || 'photo.jpg',
                                    };
                                    setFieldValue('photo', file); // Update Formik value
                                } else {
                                    console.log('Unexpected response format');
                                }
                            });
                        });
                    },
                },
                {
                    text: 'Pick from Gallery',
                    onPress: () => {
                        const options = {
                            mediaType: 'photo',
                            maxWidth: 300,
                            maxHeight: 300,
                            quality: 1,
                        };
                        launchImageLibrary(options, (response) => {

                            if (response.didCancel) {
                                console.log('User cancelled image picker');
                            } else if (response.errorCode) {
                                console.log('ImagePicker Error: ', response.errorMessage);
                            } else if (response.assets && response.assets.length > 0) {
                                const file = {
                                    uri: response.assets[0].uri,
                                    type: response.assets[0].type || 'image/jpeg',
                                    fileName: response.assets[0].fileName || 'photo.jpg',
                                };
                                setFieldValue('photo', file); // Update Formik value
                            } else {
                                console.log('Unexpected response format');
                            }
                        });
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const showDatePicker = (field, values, index = null) => {
        setDatePickerVisible(field); // Open date picker for the specific field
        setSelectedFamilyMemberIndex(index); // Set the index of the family member
        setSelectedDate(values[field] ? new Date(values[field]) : new Date()); // Set default date to current field value or today
    };

    const onDateChange = (event, date, setFieldValue) => {
        if (event.type === 'dismissed') {
            setDatePickerVisible(null); // Close the date picker if dismissed
            return;
        }
        if (date) {
            const formattedDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
            if (selectedFamilyMemberIndex !== null) {
                // Update the specific family member's DOB
                setFieldValue(`otherFamilyMembers[${selectedFamilyMemberIndex}].dob`, formattedDate);
            } else {
                setFieldValue(datePickerVisible, formattedDate); // Update Formik field value
            }
            setDatePickerVisible(null); // Close the date picker
        }
    };

    const initialFormValues = {
        //personal details
        firstName: '',
        middleName: '',
        lastName: '',
        fathersFirstName: '',
        fathersMiddleName: '',
        fathersLastName: '',
        mothersFirstName: '',
        mothersMiddleName: '',
        mothersLastName: '',
        gender: '',
        customGender: '',
        customReligion: '',
        religion: '',
        bloodGroup: '',
        nationality: 'India',
        photo: '',
        dateOfBirth: new Date().toISOString(),

        //family details

        isMarried: '',
        spouseFirstName: '',
        spouseMiddleName: '',
        spouseLastName: '',
        marriageDate: '',
        isSVPParticipant: '',
        svpDesignation: '',
        svpDateOfJoining: '',
        svpLocation: '',
        otherFamilyMembers: [],

        //Education Details
        schoolEducation: '',
        standard: '',
        graduationField: '',
        additionalGraduationFields: [],
        customGraduationField: '',
        postGraduationField: '',
        additionalPostGraduationFields: [],
        customPostGraduationField: '',

        diplomaField: '',
        additionalDiplomaFields: [],
        customDiplomaField: '',
        certification: '',


        //Communication details

        state: '',
        district: '',
        taluka: '',
        village: '',
        pincode: '',
        houseAddress: '',
        landmark: '',
        gramPanchayat: '',
        email: '',
        primaryMobilerelationToRelativearray: '',
        countryCode: '+91',
        primaryMobileNumber: '',
        familyMobileNumber: '',
        familyrelationToRelativearray: '',
        otherFamilyrelationToRelativearray: '',
        isWhatsappNumber: false,
        secondaryMobile: '',
        emergencyContact: '',
        emergencyrelationToRelativearray: '',
        otherEmergencyrelationToRelativearray: '',

        //Legal Details

        hasPAN: '',
        panNumber: '',
        panName: '',
        hasAadhar: '',
        aadharNumber: '',
        aadharName: '',
        hasDrivingLicense: '',
        licenseNumber: '',
        licenseName: '',
        licenseFile: '',
        hasAyushmanCard: '',
        ayushmanNumber: '',
        abhaAddress: '',
        hasPMJAY: '',

        //Social Details

        position: '',
        customposition: '',
        isBachatGatMember: '',
        bachatGatGroupName: '',
        bachatGatNumberOfPeople: '',
        bachatGatWorkDetails: '',
        isKrushiGroupMember: '',
        krushiGroupName: '',
        krushiGroupNumberOfPeople: '',
        krushiGroupWorkDetails: '',
        otherIncomeSource: '',
        //Bank Details
        bankName: '',
        nameOnBankAccount: '',
        ifscCode: '',
        bankBranch: '',

        //Conveyance details
        ownVehicle: '',
        vehicles: [],

    };

    // Frontend - Form submission handler
    const handleSubmitform = async (values) => {
        const formData = new FormData();
        
        // Helper function to safely append file data
        const appendFile = (key, fileData) => {
            if (fileData && fileData.uri) {
                // Ensure proper file structure for React Native
                formData.append(key, {
                    uri: Platform.OS === 'android' ? fileData.uri : fileData.uri.replace('file://', ''),
                    type: fileData.type || 'image/jpeg',
                    name: fileData.fileName || `${key}.jpg`,
                });
            } else if (fileData && typeof fileData === 'string') {
                // If it's an existing file path, pass it as is
                formData.append(key, fileData);
            }
        };
        
        // Handle vehicles array
        if (values.vehicles && Array.isArray(values.vehicles)) {
            formData.append('vehicles', JSON.stringify(values.vehicles.map(vehicle => {
                // Create a clean vehicle object without the file
                const { numberplatephoto, ...vehicleData } = vehicle;
                return vehicleData;
            })));
            
            // Append vehicle files separately
            values.vehicles.forEach((vehicle, index) => {
                if (vehicle.numberplatephoto) {
                    appendFile(`numberplatephoto_${index}`, vehicle.numberplatephoto);
                }
            });
        }
        
        // Handle otherFamilyMembers array
        if (values.otherFamilyMembers && Array.isArray(values.otherFamilyMembers)) {
            formData.append('otherFamilyMembers', JSON.stringify(values.otherFamilyMembers));
        }
        
        // Handle main files
        appendFile('photo', values.photo);
        appendFile('licenseFile', values.licenseFile);
        
        // Append other regular fields
        Object.entries(values).forEach(([key, value]) => {
            if (
                key !== 'vehicles' &&
                key !== 'otherFamilyMembers' &&
                key !== 'photo' &&
                key !== 'licenseFile'
            ) {
                formData.append(key, value === null ? 'null' : String(value));
            }
        });
        
        try {
            // Add timeout and increased maxBodyLength/maxContentLength
            const response = await axios.put(
                `${API_BASE_URL}/api/v1/userKif/${kifId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    timeout: 30000, // 30 seconds timeout
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity
                }
            );
            
            console.log('User updated successfully:', response.data);
            Alert.alert('Success', 'Data updated successfully!');
        } catch (error) {
            console.error(
                'Error updating user:',
                error.response ? error.response.data : error.message
            );
            
            // More detailed error logging
            if (error.request) {
                console.log('Request was made but no response received');
                console.log(error.request);
            }
            
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Error updating data. Please try again.'
            );
        }
    };



    const emailDomains = ['@gmail.com', '@yahoo.com', '@outlook.com'];

    const handleEmailChange = (text, setFieldValue) => {
        // Check if text contains '@' and it's not at the end
        const atIndex = text.lastIndexOf('@');
        if (atIndex !== -1 && atIndex !== text.length - 1) {
            const domainPart = text.slice(atIndex).toLowerCase();
            // Filter domains that match what user has typed after @
            const filteredDomains = emailDomains.filter(domain =>
                domain.toLowerCase().startsWith(domainPart)
            );
            setShowDropdown(filteredDomains.length > 0);
        } else if (text.endsWith('@')) {
            // Show all domains when user just typed @
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }

        // Update the field value
        setFieldValue('email', text);
    };

    const handleDomainSelect = (domain, values, setFieldValue) => {
        const userPart = values.email.split('@')[0];
        const newEmail = userPart + domain;
        setFieldValue('email', newEmail);
        setShowDropdown(false);
    };


    const addField = (fieldType, setFieldValue) => {
        const updatedFields = [...(formValues[fieldType] || []), '']; // Add a new empty string to the array
        setFieldValue(fieldType, updatedFields); // Update Formik's state
    };

    const removeField = (index, fieldType, setFieldValue) => {
        const updatedFields = formValues[fieldType].filter((_, i) => i !== index); // Remove the field at the specified index
        setFieldValue(fieldType, updatedFields); // Update Formik's state
    };


    return (
        <View style={styles.container}>
            <Text style={{ color: 'black', alignSelf: 'center', padding: '20' }}>Update Profile</Text>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.percentageText}>{progress}% Completed</Text>

            <View>
                {renderStepIndicator()}
                <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={formValues}
                        validationSchema={validationSchema[step - 1]}
                        validateOnChange
                        validateOnBlur
                        onSubmit={(values, { setSubmitting, setErrors }) => {
                            handleSubmitform(values, { setSubmitting, setErrors });
                        }}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            setFieldTouched,
                            values,
                            errors,
                            touched,
                            validateForm,

                        }) => {

                            // Recalculate progress when values change
                            useEffect(() => {
                                setProgress(calculateProgress(values));
                            }, [values]);

                            useEffect(() => {
                                const fetchCountries = async () => {
                                    try {
                                        const response = await fetch('https://restcountries.com/v2/all');
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        const data = await response.json();
                                        const countryOptions = data.map(country => ({
                                            label: country.name === 'India' ? 'Bharat' : country.name,
                                            value: country.name,
                                            code: country.callingCodes[0] ? `+${country.callingCodes[0]}` : '',
                                        }));

                                        setCountries(countryOptions);

                                        const indiaCountry = countryOptions.find(
                                            (country) => country.value === 'India' || country.value === 'Bharat'
                                        );
                                        if (indiaCountry) {
                                            setFieldValue('nationality', indiaCountry.value);
                                        }
                                    } catch (error) {
                                        console.error('Error fetching countries:', error);
                                    }
                                };

                                fetchCountries();
                            }, [setFieldValue]);
                            return (
                                <View>
                                    {step === 1 && ( //personal Details
                                        <View>
                                            <Text style={styles.label}>
                                                First Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('firstName')}
                                                onBlur={handleBlur('firstName')}
                                                value={values.firstName}
                                            />
                                            {touched.firstName && errors.firstName && (
                                                <Text style={styles.error}>{errors.firstName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Middle Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your middle name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('middleName')}
                                                onBlur={handleBlur('middleName')}
                                                value={values.middleName}
                                            />
                                            {touched.middleName && errors.middleName && (
                                                <Text style={styles.error}>{errors.middleName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Last Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your last name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('lastName')}
                                                onBlur={handleBlur('lastName')}
                                                value={values.lastName}
                                            />
                                            {touched.lastName && errors.lastName && (
                                                <Text style={styles.error}>{errors.lastName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Father First Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your father name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('fathersFirstName')}
                                                onBlur={handleBlur('fathersFirstName')}
                                                value={values.fathersFirstName}
                                            />
                                            {touched.fathersFirstName && errors.fathersFirstName && (
                                                <Text style={styles.error}>{errors.fathersFirstName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Father Middle Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('fathersMiddleName')}
                                                onBlur={handleBlur('fathersMiddleName')}
                                                value={values.fathersMiddleName}
                                            />
                                            {touched.fathersMiddleName && errors.fathersMiddleName && (
                                                <Text style={styles.error}>
                                                    {errors.fathersMiddleName}
                                                </Text>
                                            )}
                                            <Text style={styles.label}>
                                                Father Last Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('fathersLastName')}
                                                onBlur={handleBlur('fathersLastName')}
                                                value={values.fathersLastName}
                                            />
                                            {touched.fathersLastName && errors.fathersLastName && (
                                                <Text style={styles.error}>{errors.fathersLastName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Mother First Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('mothersFirstName')}
                                                onBlur={handleBlur('mothersFirstName')}
                                                value={values.mothersFirstName}
                                            />
                                            {touched.mothersFirstName && errors.mothersFirstName && (
                                                <Text style={styles.error}>{errors.mothersFirstName}</Text>
                                            )}
                                            <Text style={styles.label}>
                                                Mother Middle Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('mothersMiddleName')}
                                                onBlur={handleBlur('mothersMiddleName')}
                                                value={values.mothersMiddleName}
                                            />
                                            {touched.mothersMiddleName && errors.mothersMiddleName && (
                                                <Text style={styles.error}>
                                                    {errors.mothersMiddleName}
                                                </Text>
                                            )}
                                            <Text style={styles.label}>
                                                Mother Last Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('mothersLastName')}
                                                onBlur={handleBlur('mothersLastName')}
                                                value={values.mothersLastName}
                                            />
                                            {touched.mothersLastName && errors.mothersLastName && (
                                                <Text style={styles.error}>{errors.mothersLastName}</Text>
                                            )}

                                            {/* Gender Field */}
                                            <Text style={styles.label}>Gender <Text style={{ color: 'red' }}>*</Text></Text>
                                            <Picker
                                                selectedValue={values.gender}
                                                onValueChange={(itemValue) => setFieldValue('gender', itemValue)} // Use `setFieldValue` to update `gender`
                                                style={styles.input}>
                                                <Picker.Item label="Select Gender" value="" />
                                                <Picker.Item label="Male" value="Male" />
                                                <Picker.Item label="Female" value="Female" />
                                                <Picker.Item label="Other" value="Other" />
                                            </Picker>

                                            {touched.gender && errors.gender && (
                                                <Text style={styles.error}>{errors.gender}</Text>
                                            )}

                                            {/* Conditionally render 'Other Gender' input if 'Other' is selected */}
                                            {values.gender === 'Other' && (
                                                <View>
                                                    <Text style={styles.label}>
                                                        Please specify your gender<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter your gender"
                                                        onChangeText={handleChange('customGender')}
                                                        onBlur={handleBlur('customGender')}
                                                        value={values.customGender}
                                                    />
                                                    {touched.customGender && errors.customGender && (
                                                        <Text style={styles.error}>
                                                            {errors.customGender}
                                                        </Text>
                                                    )}
                                                </View>
                                            )}

                                            {/* Date of Birth */}
                                            <Text style={styles.label}>Date of Birth <Text style={{ color: 'red' }}>*</Text></Text>
                                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                                <TextInput
                                                    style={styles.input}
                                                    editable={false}
                                                    value={
                                                        values.dateOfBirth
                                                            ? new Date(values.dateOfBirth).toLocaleDateString(
                                                                'en-GB',
                                                            ) // Format as DD/MM/YYYY
                                                            : 'DD/MM/YYYY' // Placeholder text
                                                    }
                                                    placeholder='DD/MM/YYYY'
                                                />
                                            </TouchableOpacity>

                                            {/* Show DatePicker when pressed */}
                                            {showDatePickerdate && (
                                                <DateTimePicker
                                                    value={new Date(values.dateOfBirth || Date.now())} // Default to current date
                                                    mode="date"
                                                    display="default"
                                                    onChange={(event, selectedDate) =>
                                                        handleDateChange(event, selectedDate, setFieldValue)
                                                    }
                                                    maximumDate={new Date(2006, 11, 31)} // December 31, 2006

                                                />
                                            )}

                                            {touched.dateOfBirth && errors.dateOfBirth && (
                                                <Text style={styles.error}>{errors.dateOfBirth}</Text>
                                            )}
                                            {/* Mother Name Field */}

                                            {/* Religion Field */}
                                            <Text style={styles.label}>
                                                Religion <Text style={{ color: 'red' }}>*</Text></Text>
                                            <Picker
                                                selectedValue={values.religion}
                                                onValueChange={itemValue => {
                                                    setFieldValue('religion', itemValue);
                                                    if (itemValue !== 'other') {
                                                        setFieldValue('otherReligion', ''); // Clear other religion field if another option is selected
                                                    }
                                                }}
                                                style={styles.input}>
                                                <Picker.Item label="Select Religion" value="" />
                                                <Picker.Item label="Hindu" value="Hindu" />
                                                <Picker.Item label="Muslim" value="Muslim" />
                                                <Picker.Item label="Christian" value="Christian" />
                                                <Picker.Item label="Buddhism" value="Buddhism" />
                                                <Picker.Item label="Sikh" value="Sikh" />
                                                <Picker.Item label="Other" value="Other" />
                                            </Picker>

                                            {/* Show TextInput if 'Other' is selected */}
                                            {values.religion === 'Other' && (
                                                <View>
                                                    <Text style={styles.label}>
                                                        Please specify your religion:
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter your religion"
                                                        onChangeText={handleChange('customReligion')}
                                                        onBlur={handleBlur('customReligion')}
                                                        value={values.customReligion}
                                                    />
                                                    {touched.customReligion && errors.customReligion && (
                                                        <Text style={styles.error}>
                                                            {errors.customReligion}
                                                        </Text>
                                                    )}
                                                </View>
                                            )}

                                            {/* Display Religion Error if any */}
                                            {touched.religion && errors.religion && (
                                                <Text style={styles.error}>{errors.religion}</Text>
                                            )}

                                            {/* Blood Group Field */}
                                            <Text style={styles.label}>Blood Group *</Text>
                                            <Picker
                                                selectedValue={values.bloodGroup}
                                                onValueChange={itemValue =>
                                                    setFieldValue('bloodGroup', itemValue)
                                                }
                                                style={styles.input}>
                                                <Picker.Item label="Select Blood Group" value="" />
                                                <Picker.Item label="A+" value="A+" />
                                                <Picker.Item label="B+" value="B+" />
                                                <Picker.Item label="AB+" value="AB+" />
                                                <Picker.Item label="O+" value="O+" />
                                                <Picker.Item label="A-" value="A-" />
                                                <Picker.Item label="B-" value="B-" />
                                                <Picker.Item label="AB-" value="AB-" />
                                                <Picker.Item label="O-" value="O-" />
                                            </Picker>

                                            {/* Blood Group Error Handling */}
                                            {touched.bloodGroup && errors.bloodGroup && (
                                                <Text style={styles.error}>{errors.bloodGroup}</Text>
                                            )}

                                            {/* Nationality Field */}
                                            <Text style={styles.label}>Nationality *</Text>
                                            <Picker
                                                selectedValue={values.nationality}
                                                onValueChange={(itemValue) => setFieldValue('nationality', itemValue)}
                                                style={styles.input}
                                            >
                                                {countries.map((country) => (
                                                    <Picker.Item key={country.value} label={country.label} value={country.value} />
                                                ))}
                                            </Picker>

                                            {errors.nationality && touched.nationality && (
                                                <Text style={styles.error}>{errors.nationality}</Text>
                                            )}

                                            <View style={styles.labelContainer}>
                                                <Text style={styles.label}>
                                                    <Text style={styles.star}>*</Text> Photo
                                                </Text>
                                                <TouchableOpacity
                                                    style={styles.genderContainer}
                                                    onPress={() => handleSelfImage(setFieldValue)}
                                                >
                                                    {values.photo?.uri ? (
                                                        console.log(
                                                            'Constructed photo URL:',
                                                            values.photo.uri.replace(/\\/g, '/')
                                                        ),

                                                        <Image
                                                            source={{ uri: values.photo.uri }} // Replace backslashes with forward slashes
                                                            style={styles.photoPreview} // Ensure this style displays the image correctly
                                                        />
                                                    ) : (
                                                        <TextInput
                                                            placeholder="Upload photo"
                                                            placeholderTextColor="gray"
                                                            color="#000"
                                                            style={[styles.input, errors.photo && styles.errorInput]}
                                                            editable={false}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                                {touched.photo && errors.photo && (
                                                    <Text style={styles.error}>{errors.photo}</Text>
                                                )}
                                            </View>


                                        </View>
                                    )}

                                    {step === 2 && (//Family Details
                                        <View>
                                            <Text style={styles.label}>isMarried <Text style={{ color: 'red' }}>*</Text></Text>
                                            <Picker
                                                style={styles.input}
                                                selectedValue={values.isMarried}
                                                onValueChange={itemValue =>
                                                    setFieldValue('isMarried', itemValue)
                                                }>
                                                <Picker.Item label="Select" value="" />
                                                <Picker.Item label="Yes" value="yes" />
                                                <Picker.Item label="No" value="No" />
                                            </Picker>
                                            {touched.isMarried && errors.isMarried && (
                                                <Text style={styles.error}>
                                                    {errors.isMarried}
                                                </Text>
                                            )}

                                            {values.isMarried === 'yes' && (
                                                <View>
                                                    <Text style={styles.label}>Spouse Name <Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter spouse name"
                                                        onChangeText={handleChangeWithTouch(
                                                            setFieldValue,
                                                            setFieldTouched,
                                                        )('spouseFirstName')}
                                                        onBlur={handleBlur('spouseFirstName')}
                                                        value={values.spouseFirstName}
                                                    />
                                                    {touched.spouseFirstName && errors.spouseFirstName && (
                                                        <Text style={styles.error}>{errors.spouseFirstName}</Text>
                                                    )}

                                                    <Text style={styles.label}>Spouse Middle Name <Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter spouse middle name"
                                                        onChangeText={handleChangeWithTouch(
                                                            setFieldValue,
                                                            setFieldTouched,
                                                        )('spouseMiddleName')}
                                                        onBlur={handleBlur('spouseMiddleName')}
                                                        value={values.spouseMiddleName}
                                                    />
                                                    {touched.spouseMiddleName &&
                                                        errors.spouseMiddleName && (
                                                            <Text style={styles.error}>
                                                                {errors.spouseMiddleName}
                                                            </Text>
                                                        )}

                                                    <Text style={styles.label}>Spouse Last Name <Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter spouse last name"
                                                        onChangeText={handleChangeWithTouch(
                                                            setFieldValue,
                                                            setFieldTouched,
                                                        )('spouseLastName')}
                                                        onBlur={handleBlur('spouseLastName')}
                                                        value={values.spouseLastName}
                                                    />
                                                    {touched.spouseLastName && errors.spouseLastName && (
                                                        <Text style={styles.error}>
                                                            {errors.spouseLastName}
                                                        </Text>
                                                    )}

                                                    <Text style={styles.label}>
                                                        Marriage Date <Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => showDatePicker('marriageDate', values)}
                                                        style={styles.input}>
                                                        <Text style={{ color: 'black' }}>
                                                            {values.marriageDate ? values.marriageDate : 'DD/MM/YYYY'}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    {touched.marriageDate && errors.marriageDate && (
                                                        <Text style={styles.error}>{errors.marriageDate}</Text>
                                                    )}


                                                    <Text style={styles.label}>SVP Participant? <Text style={{ color: 'red' }}>*</Text></Text>
                                                    <Picker
                                                        style={styles.input}
                                                        selectedValue={values.isSVPParticipant}
                                                        onValueChange={itemValue =>
                                                            setFieldValue('isSVPParticipant', itemValue)
                                                        }>
                                                        <Picker.Item label="Select" value="" />
                                                        <Picker.Item label="Yes" value="yes" />
                                                        <Picker.Item label="No" value="no" />
                                                    </Picker>
                                                    {touched.isSVPParticipant && errors.isSVPParticipant && (
                                                        <Text style={styles.error}>
                                                            {errors.isSVPParticipant}
                                                        </Text>
                                                    )}

                                                    {values.isSVPParticipant === 'yes' && (
                                                        <View>
                                                            <Text style={styles.label}>SVP Designation<Text style={{ color: 'red' }}>*</Text></Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder="Enter SVP designation"
                                                                onChangeText={handleChange('svpDesignation')}
                                                                onBlur={handleBlur('svpDesignation')}
                                                                value={values.svpDesignation}
                                                            />
                                                            {touched.svpDesignation &&
                                                                errors.svpDesignation && (
                                                                    <Text style={styles.error}>
                                                                        {errors.svpDesignation}
                                                                    </Text>
                                                                )}

                                                            <Text style={styles.label}>
                                                                Date of Joining <Text style={{ color: 'red' }}>*</Text>
                                                            </Text>
                                                            <TouchableOpacity
                                                                onPress={() => showDatePicker('svpDateOfJoining', values)}
                                                                style={styles.input}>
                                                                <Text style={{ color: 'black' }}>{values.svpDateOfJoining || 'Pick a date'}</Text>
                                                            </TouchableOpacity>
                                                            {touched.svpDateOfJoining && errors.svpDateOfJoining && (
                                                                <Text style={styles.error}>{errors.svpDateOfJoining}</Text>
                                                            )}

                                                            <Text style={styles.label}>svpLocation<Text style={{ color: 'red' }}>*</Text></Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder="Enter svpLocation"
                                                                onChangeText={handleChange('svpLocation')}
                                                                onBlur={handleBlur('svpLocation')}
                                                                value={values.svpLocation}
                                                            />
                                                            {touched.svpLocation && errors.svpLocation && (
                                                                <Text style={styles.error}>
                                                                    {errors.svpLocation}
                                                                </Text>
                                                            )}
                                                        </View>
                                                    )}

                                                    {/* FieldArray for Other Family Members */}
                                                    <FieldArray
                                                        name="otherFamilyMembers"
                                                        render={arrayHelpers => (
                                                            <View>
                                                                {/* Add Another Member Button at the Top */}
                                                                <TouchableOpacity
                                                                    onPress={() =>
                                                                        arrayHelpers.push({
                                                                            name: '',
                                                                            dob: '',
                                                                            relation: '',
                                                                        })
                                                                    }
                                                                    style={styles.buttonAdd}>
                                                                    <Text style={styles.buttonText}>
                                                                        Add Another Member
                                                                    </Text>
                                                                </TouchableOpacity>

                                                                {/* Loop through otherFamilyMembers array */}
                                                                {Array.isArray(values.otherFamilyMembers) && values.otherFamilyMembers.map((_, index) => (
                                                                    <View
                                                                        key={index}
                                                                        style={styles.memberContainer}>
                                                                        <View style={styles.headerRow}>
                                                                            <Text style={styles.label}>
                                                                                Family Member {index + 1} Name <Text style={{ color: 'red' }}>*</Text>
                                                                            </Text>
                                                                            {/* Cancel (X) Icon for Removing */}
                                                                            <TouchableOpacity
                                                                                onPress={() => arrayHelpers.remove(index)}
                                                                                style={styles.cancelIcon}>
                                                                                <Text style={styles.cancelText}>X</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            placeholder="Enter name"
                                                                            onChangeText={handleChange(
                                                                                `otherFamilyMembers[${index}].name`,
                                                                            )}
                                                                            onBlur={handleBlur(
                                                                                `otherFamilyMembers[${index}].name`,
                                                                            )}
                                                                            value={
                                                                                values.otherFamilyMembers[index]?.name
                                                                            }
                                                                        />
                                                                        {touched.otherFamilyMembers?.[index]?.name &&
                                                                            errors.otherFamilyMembers?.[index]
                                                                                ?.name && (
                                                                                <Text style={styles.error}>
                                                                                    {errors.otherFamilyMembers[index].name}
                                                                                </Text>
                                                                            )}

                                                                        <Text style={styles.label}>
                                                                            Family Member {index + 1} DOB <Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TouchableOpacity
                                                                            onPress={() => showDatePicker('dob', values.otherFamilyMembers[index], index)} // Pass the index
                                                                            style={styles.input}>
                                                                            <Text style={{ color: 'black' }}>
                                                                                {values.otherFamilyMembers[index]?.dob || 'Pick a date'}
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                        {touched.otherFamilyMembers?.[index]?.dob &&
                                                                            errors.otherFamilyMembers?.[index]?.dob && (
                                                                                <Text style={styles.error}>
                                                                                    {errors.otherFamilyMembers[index].dob}
                                                                                </Text>
                                                                            )}

                                                                        <Text style={styles.label}>
                                                                            Family Member {index + 1} relation <Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            placeholder="Enter relation"
                                                                            onChangeText={handleChange(
                                                                                `otherFamilyMembers[${index}].relation`,
                                                                            )}
                                                                            onBlur={handleBlur(
                                                                                `otherFamilyMembers[${index}].relation`,
                                                                            )}
                                                                            value={
                                                                                values.otherFamilyMembers[index]?.relation
                                                                            }
                                                                        />
                                                                        {touched.otherFamilyMembers?.[index]
                                                                            ?.relation &&
                                                                            errors.otherFamilyMembers?.[index]
                                                                                ?.relation && (
                                                                                <Text style={styles.error}>
                                                                                    {
                                                                                        errors.otherFamilyMembers[index]
                                                                                            .relation
                                                                                    }
                                                                                </Text>
                                                                            )}
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        )}
                                                    />
                                                </View>
                                            )}

                                        </View>
                                    )}

                                    {step === 3 && (//Academic Details
                                        <View>
                                            <Text style={styles.label}>Education Level<Text style={{ color: 'red' }}>*</Text></Text>
                                            <Picker
                                                style={styles.input}
                                                selectedValue={values.schoolEducation}
                                                onValueChange={(itemValue) => setFieldValue('schoolEducation', itemValue)}
                                            >
                                                <Picker.Item label="Select" value="" />
                                                <Picker.Item label="9th to 12th" value="9th-12th" />
                                                <Picker.Item label="Graduation" value="graduation" />
                                                <Picker.Item label="PostGraduation" value="postGraduation" />
                                                <Picker.Item label="Diploma" value="diploma" />
                                            </Picker>
                                            {touched.schoolEducation && errors.schoolEducation && (
                                                <Text style={styles.error}>{errors.schoolEducation}</Text>
                                            )}

                                            {values.schoolEducation === '9th-12th' && (
                                                <View>
                                                    <Text style={styles.label}>9th to 12th Standard <Text style={{ color: 'red' }}>*</Text></Text>
                                                    <Dropdown
                                                        style={styles.dropdown}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        itemTextStyle={styles.itemTextStyle}
                                                        labelField="label"
                                                        valueField="value"
                                                        data={[
                                                            { label: '9th', value: '9th' },
                                                            { label: '10th', value: '10th' },
                                                            { label: '11th', value: '11th' },
                                                            { label: '12th', value: '12th' },
                                                        ]}
                                                        placeholder="Select standard"
                                                        onChange={item => setFieldValue('standard', item.value)}
                                                        value={values.standard}
                                                    />
                                                    {touched.standard && errors.standard && (
                                                        <Text style={styles.error}>{errors.standard}</Text>
                                                    )}
                                                </View>
                                            )}


                                            {values.schoolEducation === 'graduation' && (
                                                <View>
                                                    <Text style={styles.label}>Graduation Field <Text style={{ color: 'red' }}>*</Text></Text>
                                                    <Dropdown
                                                        style={styles.dropdown}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        itemTextStyle={styles.itemTextStyle}
                                                        labelField="label"
                                                        valueField="value"
                                                        data={[
                                                            ...graduationFields.map(field => ({
                                                                label: field.name, // Assuming the API returns an array of fields with "name" as the field name
                                                                value: field.name,
                                                            })),
                                                            { label: 'Other', value: 'Other' }, // Add the "Other" option
                                                        ]}
                                                        placeholder="Select Graduation Field"
                                                        onChange={item => setFieldValue('graduationField', item.value)}
                                                        value={values.graduationField}
                                                    />
                                                    {touched.graduationField && errors.graduationField && (
                                                        <Text style={styles.error}>{errors.graduationField}</Text>
                                                    )}

                                                    {/* Show TextInput if "Other" is Selected */}
                                                    {values.graduationField === 'Other' && (
                                                        <View>
                                                            <Text style={styles.label}>Specify Other Graduation Field <Text style={{ color: 'red' }}>*</Text></Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder="Enter custom graduation field"
                                                                value={values.customGraduationField}
                                                                onChangeText={text => setFieldValue('customGraduationField', text)}
                                                                onBlur={handleBlur('customGraduationField')}
                                                            />
                                                            {touched.customGraduationField && errors.customGraduationField && (
                                                                <Text style={styles.error}>{errors.customGraduationField}</Text>
                                                            )}
                                                        </View>
                                                    )}

                                                    {/* Render Additional Graduation Fields */}
                                                    {values.additionalGraduationFields && values.additionalGraduationFields.map((field, index) => (
                                                        <View key={index} style={styles.fieldContainer}>
                                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={styles.label}>Additional Field {index + 1} <Text style={{ color: 'red' }}>*</Text></Text>
                                                                {/* Remove Button */}
                                                                <TouchableOpacity onPress={() => removeField(index, 'additionalGraduationFields', setFieldValue)}>
                                                                    <Text style={styles.backButtonText}>X</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder={`Enter additional field ${index + 1}`}
                                                                value={field}
                                                                onChangeText={text => {
                                                                    const updatedFields = [...values.additionalGraduationFields];
                                                                    updatedFields[index] = text;
                                                                    setFieldValue('additionalGraduationFields', updatedFields);
                                                                }}
                                                                onBlur={handleBlur(`additionalGraduationFields[${index}]`)}
                                                            />
                                                            {touched.additionalGraduationFields?.[index] && errors.additionalGraduationFields?.[index] && (
                                                                <Text style={styles.error}>{errors.additionalGraduationFields[index]}</Text>
                                                            )}


                                                        </View>
                                                    ))}

                                                    {/* Add Button */}
                                                    <TouchableOpacity onPress={() => addField('additionalGraduationFields', setFieldValue)}>
                                                        <Text style={styles.backButtonText}>Add Additional Field</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}

                                            {values.schoolEducation === 'postGraduation' && (
                                                <View>
                                                    <Text style={styles.label}>PostGraduation Field<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <Dropdown
                                                        style={styles.dropdown}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        itemTextStyle={styles.itemTextStyle}
                                                        labelField="label"
                                                        valueField="value"
                                                        data={[
                                                            ...postGraduationFields.map(field => ({
                                                                label: field.name, // Assuming the API returns an array of fields with "name" as the field name
                                                                value: field.name,
                                                            })),
                                                            { label: 'Other', value: 'Other' }, // Add the "Other" option
                                                        ]}
                                                        placeholder="Select PostGraduation Field"
                                                        onChange={item => setFieldValue('postGraduationField', item.value)}
                                                        value={values.postGraduationField}

                                                    />
                                                    {touched.postGraduationField && errors.postGraduationField && (
                                                        <Text style={styles.error}>{errors.postGraduationField}</Text>
                                                    )}

                                                    {values.postGraduationField === 'Other' && (
                                                        <View>
                                                            <Text style={styles.label}>Specify Other PostGraduation Field <Text style={{ color: 'red' }}>*</Text></Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder="Enter custom postgraduation field"
                                                                value={values.customPostGraduationField}
                                                                onChangeText={text => setFieldValue('customPostGraduationField', text)}
                                                                onBlur={handleBlur('customPostGraduationField')}
                                                            />
                                                            {touched.customPostGraduationField && errors.customPostGraduationField && (
                                                                <Text style={styles.error}>{errors.customPostGraduationField}</Text>
                                                            )}
                                                        </View>
                                                    )}

                                                    {values.additionalPostGraduationFields && values.additionalPostGraduationFields.map((field, index) => (
                                                        <View key={index} style={styles.fieldContainer}>
                                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={styles.label}>Additional Field {index + 1} <Text style={{ color: 'red' }}>*</Text></Text>
                                                                {/* Remove Button */}
                                                                <TouchableOpacity onPress={() => removeField(index, 'additionalPostGraduationFields', setFieldValue)}>
                                                                    <Text style={styles.backButtonText}>X</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder={`Enter additional field ${index + 1}`}
                                                                value={field}
                                                                onChangeText={text => {
                                                                    const updatedFields = [...values.additionalPostGraduationFields];
                                                                    updatedFields[index] = text;
                                                                    setFieldValue('additionalPostGraduationFields', updatedFields);
                                                                }}
                                                                onBlur={handleBlur(`additionalPostGraduationFields[${index}]`)}
                                                            />
                                                            {touched.additionalPostGraduationFields?.[index] && errors.additionalPostGraduationFields?.[index] && (
                                                                <Text style={styles.error}>{errors.additionalPostGraduationFields[index]}</Text>
                                                            )}
                                                        </View>
                                                    ))}
                                                    {/* Add Button */}
                                                    <TouchableOpacity onPress={() => addField('additionalPostGraduationFields', setFieldValue)}>
                                                        <Text style={styles.backButtonText}>Add Additional Field</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            )}

                                            {values.schoolEducation === 'diploma' && (
                                                <View>
                                                    <Text style={styles.label}>Diploma Field <Text style={{ color: 'red' }}>*</Text></Text>

                                                    <Dropdown
                                                        style={styles.dropdown}
                                                        placeholderStyle={styles.placeholderStyle}
                                                        selectedTextStyle={styles.selectedTextStyle}
                                                        itemTextStyle={styles.itemTextStyle}
                                                        labelField="label"
                                                        valueField="value"
                                                        data={[
                                                            ...diplomaFields.map(field => ({
                                                                label: field.name, // Assuming the API returns an array of fields with "name" as the field name
                                                                value: field.name,
                                                            })),
                                                            { label: 'Other', value: 'Other' }, // Add the "Other" option
                                                        ]}
                                                        placeholder="Select Diploma Field"
                                                        onChange={item => setFieldValue('diplomaField', item.value)}
                                                        value={values.diplomaField}
                                                    />
                                                    {touched.diplomaField && errors.diplomaField && (
                                                        <Text style={styles.error}>{errors.diplomaField}</Text>
                                                    )}
                                                    {values.diplomaField === 'Other' && (
                                                        <View>
                                                            <Text style={styles.label}>Specify Other Diploma Field <Text style={{ color: 'red' }}>*</Text></Text>
                                                            <TextInput

                                                                style={styles.input}
                                                                placeholder="Enter custom diploma field"
                                                                value={values.customDiplomaField}
                                                                onChangeText={text => setFieldValue('customDiplomaField', text)}
                                                                onBlur={handleBlur('customDiplomaField')}
                                                            />
                                                            {touched.customDiplomaField && errors.customDiplomaField && (
                                                                <Text style={styles.error}>{errors.customDiplomaField}</Text>
                                                            )}
                                                        </View>
                                                    )}

                                                    {values.additionalDiplomaFields && values.additionalDiplomaFields.map((field, index) => (
                                                        <View key={index} style={styles.fieldContainer}>
                                                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={styles.label}>Additional Field {index + 1} <Text style={{ color: 'red' }}>*</Text></Text>
                                                                {/* Remove Button */}
                                                                <TouchableOpacity onPress={() => removeField(index, 'additionalDiplomaFields', setFieldValue)}>
                                                                    <Text style={styles.backButtonText}>X</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder={`Enter additional field ${index + 1}`}
                                                                value={field}
                                                                onChangeText={text => {
                                                                    const updatedFields = [...values.additionalDiplomaFields];
                                                                    updatedFields[index] = text;
                                                                    setFieldValue('additionalDiplomaFields', updatedFields);
                                                                }}
                                                                onBlur={handleBlur(`additionalDiplomaFields[${index}]`)}
                                                            />
                                                            {touched.additionalDiplomaFields?.[index] && errors.additionalDiplomaFields?.[index] && (
                                                                <Text style={styles.error}>{errors.additionalDiplomaFields[index]}</Text>
                                                            )}
                                                        </View>
                                                    ))}
                                                    {/* Add Button */}
                                                    <TouchableOpacity onPress={() => addField('additionalDiplomaFields', setFieldValue)}>
                                                        <Text style={styles.backButtonText}>Add Additional Field</Text>
                                                    </TouchableOpacity>



                                                </View>
                                            )}
                                            <TouchableOpacity >


                                            </TouchableOpacity>

                                            <Text style={styles.label}>Any Certification <Text style={{ color: 'red' }}>*</Text></Text>
                                            <Picker
                                                style={styles.input}
                                                selectedValue={values.certification}
                                                onValueChange={(itemValue) => setFieldValue('certification', itemValue)}
                                            >
                                                <Picker.Item label="Select" value="" />
                                                <Picker.Item label="Yes" value="yes" />
                                                <Picker.Item label="No" value="no" />
                                            </Picker>
                                            {touched.certification && errors.certification && (
                                                <Text style={styles.error}>{errors.certification}</Text>
                                            )}


                                        </View>
                                    )}

                                    {step === 4 && (//Communication Details
                                        <View>
                                            {/* State, District, Taluka, Village */}
                                            <Text style={styles.label}>
                                                State <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={states.map(state => ({ label: state.StateName, value: state.StateName }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select State"
                                                value={values.state}
                                                onChange={item => {
                                                    setFieldValue('state', item.value);
                                                    handleStateChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.state && errors.state && (
                                                <Text style={styles.error}>{errors.state}</Text>
                                            )}

                                            {/* District Dropdown */}
                                            <Text style={styles.label}>
                                                District <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={districts.map(district => ({ label: district.Districtname, value: district.Districtname }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select District"
                                                value={values.district}
                                                onChange={item => {
                                                    setFieldValue('district', item.value);
                                                    handleDistrictChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.district && errors.district && (
                                                <Text style={styles.error}>{errors.district}</Text>
                                            )}
                                            {/* Taluka Dropdown */}
                                            <Text style={styles.label}>
                                                Taluka <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={subdistricts.map(taluka => ({ label: taluka['Sub-distname'], value: taluka['Sub-distname'] }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Taluka"
                                                value={values.taluka}
                                                onChange={item => {
                                                    setFieldValue('taluka', item.value);
                                                    handleSubdistrictChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.taluka && errors.taluka && (
                                                <Text style={styles.error}>{errors.taluka}</Text>
                                            )}
                                            {/* Village Dropdown */}
                                            <Text style={styles.label}>
                                                Village <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={villages.map(village => ({ label: village.VillageName, value: village.VillageName }))}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Village"
                                                value={values.village}
                                                onChange={item => {
                                                    setFieldValue('village', item.value);
                                                    handleVillageChange(item.value, setFieldValue); // Call the handler for further logic
                                                }}
                                            />
                                            {touched.village && errors.village && (
                                                <Text style={styles.error}>{errors.village}</Text>
                                            )}


                                            <Text style={styles.label}>
                                                Pincode <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Pincode"
                                                value={values.pincode}
                                                editable={false}
                                            />
                                            {touched.pincode && errors.pincode && (
                                                <Text style={styles.error}>{errors.pincode}</Text>
                                            )}
                                            {/* House Address, Landmark, gramPanchayat */}
                                            <Text style={styles.label}>
                                                House Address <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your house address"
                                                onChangeText={handleChange('houseAddress')}
                                                onBlur={handleBlur('houseAddress')}
                                                value={values.houseAddress}
                                            />
                                            {touched.houseAddress && errors.houseAddress && (
                                                <Text style={styles.error}>{errors.houseAddress}</Text>
                                            )}

                                            <Text style={styles.label}>
                                                Landmark<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter landmark"
                                                onChangeText={handleChange('landmark')}
                                                onBlur={handleBlur('landmark')}
                                                value={values.landmark}
                                            />
                                            {touched.landmark && errors.landmark && (
                                                <Text style={styles.error}>{errors.landmark}</Text>
                                            )}

                                            <Text style={styles.label}>
                                                gramPanchayat<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter gramPanchayat"
                                                onChangeText={handleChange('gramPanchayat')}
                                                onBlur={handleBlur('gramPanchayat')}
                                                value={values.gramPanchayat}
                                            />
                                            {touched.gramPanchayat && errors.gramPanchayat && (
                                                <Text style={styles.error}>{errors.gramPanchayat}</Text>
                                            )}

                                            <Text style={styles.label}>Email</Text>
                                            <View style={{ position: 'relative' }}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Enter your email"
                                                    onChangeText={(text) => {
                                                        handleEmailChange(text, setFieldValue);
                                                        handleChange('email')(text);
                                                    }}
                                                    onBlur={handleBlur('email')}
                                                    value={values.email}
                                                    autoCapitalize="none"
                                                    keyboardType="email-address"
                                                />
                                                {showDropdown && (
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: 40,
                                                        left: 0,
                                                        width: '100%',
                                                        backgroundColor: 'white',
                                                        borderWidth: 1,
                                                        borderTopWidth: 0,
                                                        borderColor: '#ccc',
                                                        zIndex: 1000,
                                                        elevation: 5, // for Android
                                                    }}>
                                                        {emailDomains
                                                            .filter(domain => {
                                                                const atIndex = values.email.lastIndexOf('@');
                                                                if (atIndex === -1) return true;
                                                                const domainPart = values.email.slice(atIndex).toLowerCase();
                                                                return domain.toLowerCase().startsWith(domainPart);
                                                            })
                                                            .map((domain, index) => (
                                                                <Pressable
                                                                    key={index}
                                                                    style={({ pressed }) => ({
                                                                        padding: 8,
                                                                        borderBottomWidth: 1,
                                                                        borderColor: '#ccc',
                                                                        backgroundColor: pressed ? '#e9e9e9' : '#f9f9f9',
                                                                    })}
                                                                    onPress={() => handleDomainSelect(domain, values, setFieldValue)}
                                                                >
                                                                    <Text>{domain}</Text>
                                                                </Pressable>
                                                            ))}
                                                    </View>
                                                )}
                                            </View>
                                            {touched.email && errors.email && (
                                                <Text style={{ color: 'red', marginTop: 5 }}>{errors.email}</Text>
                                            )}


                                            {/* Primary Phone Number */}
                                            <Text style={styles.label}>
                                                Primary Phone Number <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Picker
                                                style={styles.input}
                                                selectedValue={values.primaryMobilerelationToRelativearray}
                                                onValueChange={value => setFieldValue('primaryMobilerelationToRelativearray', value)}
                                            >
                                                <Picker.Item label="Own" value="own" />
                                                <Picker.Item label="Family" value="family" />
                                            </Picker>
                                            {touched.primaryMobilerelationToRelativearray && errors.primaryMobilerelationToRelativearray && (
                                                <Text style={styles.error}>{errors.primaryMobilerelationToRelativearray}</Text>
                                            )}

                                            {values.primaryMobilerelationToRelativearray === 'own' ? (
                                                <>
                                                    <Text style={styles.label}>
                                                        Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                        <TextInput
                                                            style={[styles.input, { flex: 1 }]}
                                                            keyboardType="phone-pad"
                                                            onChangeText={handleChange('countryCode')}
                                                            onBlur={handleBlur('countryCode')}
                                                            value={values.countryCode}
                                                        />

                                                        <TextInput
                                                            style={[styles.input, { flex: 3 }]}
                                                            placeholder="Enter your phone number"
                                                            keyboardType="phone-pad"
                                                            onChangeText={handleChange('primaryMobileNumber')}
                                                            onBlur={handleBlur('primaryMobileNumber')}
                                                            value={values.primaryMobileNumber}
                                                        />

                                                    </View>
                                                    {touched.primaryMobileNumber && errors.primaryMobileNumber && (
                                                        <Text style={styles.error}>{errors.primaryMobileNumber}</Text>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <Text style={styles.label}>
                                                        Family Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                        <TextInput
                                                            style={[styles.input, { flex: 1 }]}
                                                            keyboardType="phone-pad"
                                                            onChangeText={handleChange('countryCode')}
                                                            onBlur={handleBlur('countryCode')}
                                                            value={values.countryCode}
                                                        />
                                                        <TextInput
                                                            style={[styles.input, { flex: 3 }]}
                                                            placeholder="Enter your phone number"
                                                            keyboardType="phone-pad"
                                                            onChangeText={handleChange('familyMobileNumber')}
                                                            onBlur={handleBlur('familyMobileNumber')}
                                                            value={values.familyMobileNumber}
                                                        />

                                                    </View>
                                                    {touched.familyMobileNumber && errors.familyMobileNumber && (
                                                        <Text style={styles.error}>{errors.familyMobileNumber}</Text>
                                                    )}
                                                    <Text style={styles.label}>
                                                        Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <Picker
                                                        selectedValue={values.familyrelationToRelativearray}
                                                        onValueChange={value => setFieldValue('familyrelationToRelativearray', value)}
                                                        style={styles.input}
                                                    >
                                                        <Picker.Item label="Parent" value="parent" />
                                                        <Picker.Item label="Siblings" value="siblings" />
                                                        <Picker.Item label="Other" value="other" />
                                                    </Picker>
                                                    {touched.familyrelationToRelativearray && errors.familyrelationToRelativearray && (
                                                        <Text style={styles.error}>{errors.familyrelationToRelativearray}</Text>
                                                    )}
                                                    {values.familyrelationToRelativearray === 'other' && (
                                                        <View>
                                                            <Text style={styles.label}>
                                                                Specify relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                            </Text>
                                                            <TextInput
                                                                style={styles.input}
                                                                placeholder="Specify relationToRelativearray"
                                                                onChangeText={handleChange('otherFamilyrelationToRelativearray')}
                                                                onBlur={handleBlur('otherFamilyrelationToRelativearray')}
                                                                value={values.otherFamilyrelationToRelativearray}
                                                            />

                                                        </View>
                                                    )}
                                                    {touched.otherFamilyrelationToRelativearray && errors.otherFamilyrelationToRelativearray && (
                                                        <Text style={styles.error}>{errors.otherFamilyrelationToRelativearray}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* WhatsApp Number */}
                                            {values.primaryMobilerelationToRelativearray === 'own' && (
                                                <View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <CheckBox
                                                            value={values.isWhatsappNumber}
                                                            onValueChange={() => setFieldValue('isWhatsappNumber', !values.isWhatsappNumber)}
                                                            tintColors={{ true: 'black', false: 'black' }}

                                                        />
                                                        <Text style={styles.label}>Use as WhatsApp number</Text>

                                                    </View>
                                                    {values.isWhatsappNumber && (
                                                        <>
                                                            <Text style={styles.label}>
                                                                WhatsApp Number<Text style={{ color: 'red' }}>*</Text>
                                                            </Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <TextInput
                                                                    style={[styles.input, { flex: 1 }]}
                                                                    keyboardType="phone-pad"
                                                                    onChangeText={handleChange('countryCode')}
                                                                    onBlur={handleBlur('countryCode')}
                                                                    value={values.countryCode}
                                                                />


                                                                <TextInput
                                                                    style={[styles.input, { flex: 3 }]}
                                                                    placeholder="Enter WhatsApp number"
                                                                    value={values.primaryMobileNumber}
                                                                    editable={false}
                                                                />
                                                            </View>
                                                        </>
                                                    )}
                                                </View>
                                            )}

                                            {/* Secondary Phone Number */}
                                            <Text style={styles.label}>
                                                Secondary Phone Number<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                    <TextInput
                                                        style={[styles.input, { flex: 1 }]}
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('countryCode')}
                                                        onBlur={handleBlur('countryCode')}
                                                        value={values.countryCode}
                                                    />
                                                    <TextInput
                                                        style={[styles.input, { flex: 3 }]}
                                                        placeholder="Enter secondary phone number"
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('secondaryMobile')}
                                                        onBlur={handleBlur('secondaryMobile')}
                                                        value={values.secondaryMobile}
                                                    />
                                                </View>
                                                {touched.secondaryMobile && errors.secondaryMobile && (
                                                    <Text style={styles.error}>{errors.secondaryMobile}</Text>
                                                )}
                                            </View>
                                            {/* Emergency Contact Number */}
                                            <Text style={styles.label}>
                                                Emergency Contact Number<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                    <TextInput
                                                        style={[styles.input, { flex: 1 }]}
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('countryCode')}
                                                        onBlur={handleBlur('countryCode')}
                                                        value={values.countryCode}
                                                    />
                                                    <TextInput
                                                        style={[styles.input, { flex: 3 }]}
                                                        placeholder="Enter emergency contact number"
                                                        keyboardType="phone-pad"
                                                        onChangeText={handleChange('emergencyContact')}
                                                        onBlur={handleBlur('emergencyContact')}
                                                        value={values.emergencyContact}
                                                    />
                                                </View>
                                                {touched.emergencyContact && errors.emergencyContact && (
                                                    <Text style={styles.error}>{errors.emergencyContact}</Text>
                                                )}
                                            </View>

                                            <Text style={styles.label}>
                                                Emergency Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <Picker
                                                selectedValue={values.emergencyrelationToRelativearray}
                                                onValueChange={value => setFieldValue('emergencyrelationToRelativearray', value)}
                                                style={styles.input}
                                            >
                                                <Picker.Item label="Parent" value="parent" />
                                                <Picker.Item label="Siblings" value="siblings" />
                                                <Picker.Item label="Other" value="other" />
                                            </Picker>
                                            {touched.emergencyrelationToRelativearray && errors.emergencyrelationToRelativearray && (
                                                <Text style={styles.error}>{errors.emergencyrelationToRelativearray}</Text>
                                            )}

                                            {values.emergencyrelationToRelativearray === 'other' && (
                                                <>
                                                    <Text style={styles.label}>
                                                        Specify the relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Specify relationToRelativearray"
                                                        onChangeText={handleChange('otherEmergencyrelationToRelativearray')}
                                                        onBlur={handleBlur('otherEmergencyrelationToRelativearray')}
                                                        value={values.otherEmergencyrelationToRelativearray}
                                                    />
                                                    {touched.otherEmergencyrelationToRelativearray && errors.otherEmergencyrelationToRelativearray && (
                                                        <Text style={styles.error}>{errors.otherEmergencyrelationToRelativearray}</Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    )}

                                    {step === 5 && (//Legal Details
                                        <View>
                                            {/* PAN Card Details */}
                                            <Text style={styles.label}>PAN Card Details<Text style={{ color: 'red' }}>*</Text></Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.hasPAN}
                                                onChange={item => setFieldValue('hasPAN', item.value)}
                                            />
                                            {touched.hasPAN && errors.hasPAN && (
                                                <Text style={styles.error}>{errors.hasPAN}</Text>
                                            )}
                                            {values.hasPAN === 'Yes' && (
                                                <>
                                                    <Text style={styles.label}>PAN Card Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter your PAN number"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('panNumber')}
                                                        onBlur={handleBlur('panNumber')}
                                                        value={values.panNumber}
                                                    />
                                                    {touched.panNumber && errors.panNumber && (
                                                        <Text style={styles.error}>{errors.panNumber}</Text>
                                                    )}

                                                    <Text style={styles.label}>Name on PAN Card<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter the name on PAN card"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('panName')}
                                                        onBlur={handleBlur('panName')}
                                                        value={values.panName}
                                                    />
                                                    {touched.panName && errors.panName && (
                                                        <Text style={styles.error}>{errors.panName}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* Aadhar Card Details */}
                                            <Text style={styles.label}>Aadhar Card Details<Text style={{ color: 'red' }}>*</Text></Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.hasAadhar}
                                                onChange={item => setFieldValue('hasAadhar', item.value)}
                                            />
                                            {touched.hasAadhar && errors.hasAadhar && (
                                                <Text style={styles.error}>{errors.hasAadhar}</Text>
                                            )}
                                            {values.hasAadhar === 'Yes' && (
                                                <>
                                                    <Text style={styles.label}>Aadhar Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter your Aadhar number"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('aadharNumber')}
                                                        onBlur={handleBlur('aadharNumber')}
                                                        value={values.aadharNumber}
                                                    />
                                                    {touched.aadharNumber && errors.aadharNumber && (
                                                        <Text style={styles.error}>{errors.aadharNumber}</Text>
                                                    )}

                                                    <Text style={styles.label}>Name on Aadhar Card<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter the name on Aadhar card"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('aadharName')}
                                                        onBlur={handleBlur('aadharName')}
                                                        value={values.aadharName}
                                                    />
                                                    {touched.aadharName && errors.aadharName && (
                                                        <Text style={styles.error}>{errors.aadharName}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* Driving License Details */}
                                            <Text style={styles.label}>Driving License Details<Text style={{ color: 'red' }}>*</Text></Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.hasDrivingLicense}
                                                onChange={item => setFieldValue('hasDrivingLicense', item.value)}
                                            />
                                            {touched.hasDrivingLicense && errors.hasDrivingLicense && (
                                                <Text style={styles.error}>{errors.hasDrivingLicense}</Text>
                                            )}
                                            {values.hasDrivingLicense === 'Yes' && (
                                                <>
                                                    <Text style={styles.label}>Driving License Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter your Driving License number"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('licenseNumber')}
                                                        onBlur={handleBlur('licenseNumber')}
                                                        value={values.licenseNumber}
                                                    />
                                                    {touched.licenseNumber && errors.licenseNumber && (
                                                        <Text style={styles.error}>{errors.licenseNumber}</Text>
                                                    )}

                                                    <Text style={styles.label}>Name on Driving License<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter the name on Driving License"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('licenseName')}
                                                        onBlur={handleBlur('licenseName')}
                                                        value={values.licenseName}
                                                    />
                                                    {touched.licenseName && errors.licenseName && (
                                                        <Text style={styles.error}>{errors.licenseName}</Text>
                                                    )}

                                                    <Text style={styles.label}>
                                                        Upload Driving License <Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TouchableOpacity
                                                        style={styles.uploadButton}
                                                        onPress={() => handleFile('licenseFile', setFieldValue)}
                                                    >
                                                        <Text style={styles.uploadButtonText}>Select License File</Text>
                                                    </TouchableOpacity>
                                                    {selectedFiles.licenseFile && (
                                                        <Text style={styles.fileName}>
                                                            Selected File: {selectedFiles.licenseFile.name}
                                                        </Text>
                                                    )}
                                                    {touched.licenseFile && errors.licenseFile && (
                                                        <Text style={styles.error}>{errors.licenseFile}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* Ayushman Card Details */}
                                            <Text style={styles.label}>Ayushman Card Details<Text style={{ color: 'red' }}>*</Text></Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}

                                                data={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.hasAyushmanCard}
                                                onChange={item => setFieldValue('hasAyushmanCard', item.value)}
                                            />
                                            {touched.hasAyushmanCard && errors.hasAyushmanCard && (
                                                <Text style={styles.error}>{errors.hasAyushmanCard}</Text>
                                            )}
                                            {values.hasAyushmanCard === 'Yes' && (
                                                <>
                                                    <Text style={styles.label}>Ayushman Card Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter Ayushman Card number"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('ayushmanNumber')}
                                                        onBlur={handleBlur('ayushmanNumber')}
                                                        value={values.ayushmanNumber}
                                                    />
                                                    {touched.ayushmanNumber && errors.ayushmanNumber && (
                                                        <Text style={styles.error}>{errors.ayushmanNumber}</Text>
                                                    )}

                                                    <Text style={styles.label}>ABHA Address<Text style={{ color: 'red' }}>*</Text></Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter ABHA address"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('abhaAddress')}
                                                        onBlur={handleBlur('abhaAddress')}
                                                        value={values.abhaAddress}
                                                    />
                                                    {touched.abhaAddress && errors.abhaAddress && (
                                                        <Text style={styles.error}>{errors.abhaAddress}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* Pradhan Mantri Jan Arogya Yojna */}
                                            <Text style={styles.label}>Pradhan Mantri Jan Arogya Yojna<Text style={{ color: 'red' }}>*</Text></Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}

                                                data={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.hasPMJAY}
                                                onChange={item => setFieldValue('hasPMJAY', item.value)}
                                            />
                                            {touched.hasPMJAY && errors.hasPMJAY && (
                                                <Text style={styles.error}>{errors.hasPMJAY}</Text>
                                            )}
                                        </View>
                                    )}

                                    {step === 6 && (//Social Details
                                        <View>
                                            {/* Position Dropdown */}
                                            <Text style={styles.label}>
                                                Position
                                            </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}

                                                data={[
                                                    { label: 'Sarpanch', value: 'sarpanch' },
                                                    { label: 'Upsarpanch', value: 'upsarpanch' },
                                                    { label: 'Police Patil', value: 'policePatil' },
                                                    { label: 'Other', value: 'other' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Position"
                                                value={values.position}
                                                onChange={item => setFieldValue('position', item.value)}
                                            />
                                            {values.position === 'other' && (
                                                <>
                                                    <Text style={styles.label}>Specify Position</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter position"
                                                        placeholderTextColor="#aaa"
                                                        onChangeText={handleChange('customposition')}
                                                        onBlur={handleBlur('customposition')}
                                                        value={values.customposition}
                                                    />
                                                    {touched.customposition && errors.customposition && (
                                                        <Text style={styles.error}>{errors.customposition}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* isBachatGatMember Sadsya */}
                                            <Text style={styles.label}>isBachatGatMember Sadsya</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}

                                                data={[
                                                    { label: 'Yes', value: 'yes' },
                                                    { label: 'No', value: 'no' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.isBachatGatMember}
                                                onChange={item => setFieldValue('isBachatGatMember', item.value)}
                                            />
                                            {values.isBachatGatMember === 'yes' && (
                                                <>
                                                    <Text style={styles.label}>Name of Group</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter group name"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('bachatGatGroupName')}
                                                        onBlur={handleBlur('bachatGatGroupName')}
                                                        value={values.bachatGatGroupName}
                                                    />
                                                    {touched.bachatGatGroupName && errors.bachatGatGroupName && (
                                                        <Text style={styles.error}>{errors.bachatGatGroupName}</Text>
                                                    )}

                                                    <Text style={styles.label}>Number of People</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter number of people"
                                                        placeholderTextColor="gray"
                                                        keyboardType="numeric"
                                                        onChangeText={handleChange('bachatGatNumberOfPeople')}
                                                        onBlur={handleBlur('bachatGatNumberOfPeople')}
                                                        value={values.bachatGatNumberOfPeople}
                                                    />
                                                    {touched.bachatGatNumberOfPeople && errors.bachatGatNumberOfPeople && (
                                                        <Text style={styles.error}>{errors.bachatGatNumberOfPeople}</Text>
                                                    )}

                                                    <Text style={styles.label}>Work Details</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter work details"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('bachatGatWorkDetails')}
                                                        onBlur={handleBlur('bachatGatWorkDetails')}
                                                        value={values.bachatGatWorkDetails}
                                                    />
                                                    {touched.bachatGatWorkDetails && errors.bachatGatWorkDetails && (
                                                        <Text style={styles.error}>{errors.bachatGatWorkDetails}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* Krushi Group */}
                                            <Text style={styles.label}>Krushi Group</Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}

                                                data={[
                                                    { label: 'Yes', value: 'yes' },
                                                    { label: 'No', value: 'no' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                value={values.isKrushiGroupMember}
                                                onChange={item => setFieldValue('isKrushiGroupMember', item.value)}
                                            />
                                            {values.isKrushiGroupMember === 'yes' && (
                                                <>
                                                    <Text style={styles.label}>Name of Group</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter group name"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('krushiGroupName')}
                                                        onBlur={handleBlur('krushiGroupName')}
                                                        value={values.krushiGroupName}
                                                    />
                                                    {touched.krushiGroupName && errors.krushiGroupName && (
                                                        <Text style={styles.error}>{errors.krushiGroupName}</Text>
                                                    )}

                                                    <Text style={styles.label}>Number of People</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter number of people"
                                                        placeholderTextColor="gray"
                                                        keyboardType="numeric"
                                                        onChangeText={handleChange('krushiGroupNumberOfPeople')}
                                                        onBlur={handleBlur('krushiGroupNumberOfPeople')}
                                                        value={values.krushiGroupNumberOfPeople}
                                                    />
                                                    {touched.krushiGroupNumberOfPeople && errors.krushiGroupNumberOfPeople && (
                                                        <Text style={styles.error}>{errors.krushiGroupNumberOfPeople}</Text>
                                                    )}

                                                    <Text style={styles.label}>Work Details</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Enter work details"
                                                        placeholderTextColor="gray"
                                                        onChangeText={handleChange('krushiGroupWorkDetails')}
                                                        onBlur={handleBlur('krushiGroupWorkDetails')}
                                                        value={values.krushiGroupWorkDetails}
                                                    />
                                                    {touched.krushiGroupWorkDetails && errors.krushiGroupWorkDetails && (
                                                        <Text style={styles.error}>{errors.krushiGroupWorkDetails}</Text>
                                                    )}
                                                </>
                                            )}

                                            {/* Other Income Source */}
                                            <Text style={styles.label}>Other Income Source</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter other income source"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChange('otherIncomeSource')}
                                                onBlur={handleBlur('otherIncomeSource')}
                                                value={values.otherIncomeSource}
                                            />
                                            {touched.otherIncomeSource && errors.otherIncomeSource && (
                                                <Text style={styles.error}>{errors.otherIncomeSource}</Text>
                                            )}
                                        </View>
                                    )}

                                    {step === 7 && (//Bank Details
                                        <View>
                                            {/* Bank Name */}
                                            <Text style={styles.label}>
                                                Bank Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your bank name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('bankName')}
                                                onBlur={handleBlur('bankName')}
                                                value={values.bankName}
                                            />
                                            {touched.bankName && errors.bankName && (
                                                <Text style={styles.error}>{errors.bankName}</Text>
                                            )}

                                            {/* Name on Bank Account */}
                                            <Text style={styles.label}>
                                                Name on Bank Account <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter the name on bank account"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('nameOnBankAccount')}
                                                onBlur={handleBlur('nameOnBankAccount')}
                                                value={values.nameOnBankAccount}
                                            />
                                            {touched.nameOnBankAccount && errors.nameOnBankAccount && (
                                                <Text style={styles.error}>{errors.nameOnBankAccount}</Text>
                                            )}

                                            {/* IFSC Code */}
                                            <Text style={styles.label}>
                                                IFSC Code <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your bank IFSC code"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('ifscCode')}
                                                onBlur={handleBlur('ifscCode')}
                                                value={values.ifscCode}
                                            />
                                            {touched.ifscCode && errors.ifscCode && (
                                                <Text style={styles.error}>{errors.ifscCode}</Text>
                                            )}

                                            {/* Branch Name */}
                                            <Text style={styles.label}>
                                                Branch Name <Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Enter your bank branch name"
                                                placeholderTextColor="gray"
                                                onChangeText={handleChangeWithTouch(
                                                    setFieldValue,
                                                    setFieldTouched,
                                                )('bankBranch')}
                                                onBlur={handleBlur('bankBranch')}
                                                value={values.bankBranch}
                                            />
                                            {touched.bankBranch && errors.bankBranch && (
                                                <Text style={styles.error}>{errors.bankBranch}</Text>
                                            )}
                                        </View>
                                    )}

                                    {step === 8 && ( //Conveyance details
                                        <View>
                                            <Text style={styles.label}>Do you have a vehicle? </Text>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                itemTextStyle={styles.itemTextStyle}
                                                data={[
                                                    { label: 'Yes', value: 'yes' },
                                                    { label: 'No', value: 'no' },
                                                ]}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select"
                                                onChange={item => setFieldValue('ownVehicle', item.value)}
                                                value={values.ownVehicle}
                                            />
                                            {touched.ownVehicle && errors.ownVehicle && (
                                                <Text style={styles.error}>{errors.ownVehicle}</Text>
                                            )}

                                            {values.ownVehicle === 'yes' && (
                                                <FieldArray name="vehicles"
                                                    render={arrayHelpers => (
                                                        <View>
                                                            {values.vehicles && values.vehicles.length > 0 ? (
                                                                values.vehicles.map((vehicle, index) => (
                                                                    <View key={index} style={styles.vehicleContainer}>
                                                                        {/* Ownership Type */}
                                                                        <View style={styles.ownershipContainer}>
                                                                            <Text style={styles.label}>Ownership Type</Text>
                                                                            <TouchableOpacity
                                                                                onPress={() => arrayHelpers.remove(index)}
                                                                                style={styles.cancelIcon}
                                                                            >
                                                                                <Text style={styles.cancelText}>X</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                        <Dropdown
                                                                            style={styles.dropdown}
                                                                            data={[
                                                                                { label: 'Own', value: 'own' },
                                                                                { label: 'Relative', value: 'relative' },
                                                                            ]}
                                                                            placeholderStyle={styles.placeholderStyle}
                                                                            selectedTextStyle={styles.selectedTextStyle}
                                                                            itemTextStyle={styles.itemTextStyle}
                                                                            labelField="label"
                                                                            valueField="value"
                                                                            placeholder="Select Ownership"
                                                                            onChange={item =>
                                                                                setFieldValue(`vehicles.${index}.ownershipType`, item.value)
                                                                            }
                                                                            value={vehicle?.ownershipType}
                                                                        />
                                                                        {/* Specify relationToRelativearray if Relative */}
                                                                        {vehicle?.ownershipType === 'relative' && (
                                                                            <>
                                                                                <Text style={styles.label}>Specify relation</Text>
                                                                                <TextInput
                                                                                    style={styles.input}
                                                                                    placeholder="Enter relationToRelativearray"
                                                                                    onChangeText={handleChange(
                                                                                        `vehicles.${index}.relation`
                                                                                    )}
                                                                                    value={vehicle?.relation}
                                                                                />
                                                                            </>
                                                                        )}

                                                                        {/* Vehicle Type */}
                                                                        <Text style={styles.label}>Type of Vehicle</Text>
                                                                        <Dropdown
                                                                            style={styles.dropdown}
                                                                            data={[
                                                                                { label: 'Two Wheeler', value: 'twoWheeler' },
                                                                                { label: 'Four Wheeler', value: 'fourWheeler' },
                                                                            ]}
                                                                            placeholder="Select Vehicle Type"
                                                                            placeholderStyle={styles.placeholderStyle}
                                                                            selectedTextStyle={styles.selectedTextStyle}
                                                                            itemTextStyle={styles.itemTextStyle}
                                                                            labelField="label"
                                                                            valueField="value"
                                                                            onChange={item =>
                                                                                setFieldValue(`vehicles.${index}.vehicleType`, item.value)
                                                                            }
                                                                            value={vehicle?.vehicleType}
                                                                        />

                                                                        {/* Purchase Date */}
                                                                        <Text style={styles.label}>Purchase Date</Text>
                                                                        <TouchableOpacity
                                                                            style={styles.input}
                                                                            onPress={() => setShowpurchaseDatearrayPicker(true)}
                                                                        >
                                                                            <Text style={styles.datePickerText}>
                                                                                {values.vehicles[index]?.purchaseDate || 'Select Purchase Date'}
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                        {showpurchaseDatearrayPicker && (
                                                                            <DateTimePicker
                                                                                value={
                                                                                    values.vehicles[index]?.purchaseDate
                                                                                        ? new Date(values.vehicles[index].purchaseDate)
                                                                                        : new Date()
                                                                                }
                                                                                mode="date"
                                                                                display="default"
                                                                                onChange={(event, selectedDate) => {
                                                                                    setShowpurchaseDatearrayPicker(false);
                                                                                    if (selectedDate) {
                                                                                        setFieldValue(
                                                                                            `vehicles.${index}.purchaseDate`,
                                                                                            selectedDate.toISOString().split('T')[0] // Format to YYYY-MM-DD
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                        {/* insuranceStatusarray */}
                                                                        <Text style={styles.label}>insuranceStatusarray?</Text>
                                                                        <Dropdown
                                                                            style={styles.dropdown}
                                                                            placeholderStyle={styles.placeholderStyle}
                                                                            selectedTextStyle={styles.selectedTextStyle}
                                                                            itemTextStyle={styles.itemTextStyle}
                                                                            labelField="label"
                                                                            valueField="value"
                                                                            data={[
                                                                                { label: 'Yes', value: 'yes' },
                                                                                { label: 'No', value: 'no' },
                                                                            ]}
                                                                            placeholder="Select"
                                                                            onChange={item =>
                                                                                setFieldValue(`vehicles.${index}.insurance`, item.value)
                                                                            }
                                                                            value={vehicle?.insurance}
                                                                        />

                                                                        {/* insuranceStatusarray Expiry Date */}
                                                                        {vehicle?.insurance === 'yes' && (
                                                                            <>
                                                                                <Text style={styles.label}>insuranceStatusarray Expiry Date</Text>
                                                                                <TouchableOpacity
                                                                                    style={styles.input}
                                                                                    onPress={() => setShowinsuranceExpiryDatearrayPicker(true)}
                                                                                >
                                                                                    <Text style={styles.datePickerText}>
                                                                                        {values.vehicles[index]?.insuranceExpiry || 'Select Expiry Date'}
                                                                                    </Text>
                                                                                </TouchableOpacity>
                                                                                {showinsuranceExpiryDatearrayPicker && (
                                                                                    <DateTimePicker
                                                                                        value={
                                                                                            values.vehicles[index]?.insuranceExpiry
                                                                                                ? new Date(values.vehicles[index].insuranceExpiry)
                                                                                                : new Date()
                                                                                        }
                                                                                        mode="date"
                                                                                        display="default"
                                                                                        onChange={(event, selectedDate) => {
                                                                                            setShowinsuranceExpiryDatearrayPicker(false);
                                                                                            if (selectedDate) {
                                                                                                setFieldValue(
                                                                                                    `vehicles[${index}].insuranceExpiry`,
                                                                                                    selectedDate.toISOString().split('T')[0] // Format to YYYY-MM-DD
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        )}

                                                                        <Text style={styles.label}>
                                                                            Upload Numberplate Photo <Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TouchableOpacity
                                                                            style={styles.uploadButton}
                                                                            onPress={() => handleFile(`numberplatephoto`, setFieldValue)}
                                                                        >
                                                                            <Text style={styles.uploadButtonText}>Select Numberplate Photo</Text>
                                                                        </TouchableOpacity>
                                                                        {values.vehicles?.[index]?.numberplatephoto && (
                                                                            <Text style={styles.fileName}>
                                                                                Selected File: {values.vehicles[index].numberplatephoto.fileName || values.vehicles[index].numberplatephoto.name}
                                                                            </Text>
                                                                        )}
                                                                        {touched.vehicles?.[index]?.noplatephoto && errors.vehicles?.[index]?.noplatephoto && (
                                                                            <Text style={styles.error}>{errors.vehicles[index].numberplatephoto}</Text>
                                                                        )}

                                                                        {/* odometerReadingarray Reading */}
                                                                        <Text style={styles.label}>Odometer (Kms) Reading</Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            placeholder="Enter Kms"
                                                                            keyboardType="numeric"
                                                                            onChangeText={handleChange(`vehicles.${index}.odometer`)}
                                                                            value={vehicle?.odometer}
                                                                        />


                                                                    </View>
                                                                ))
                                                            ) : null}

                                                            {/* Add Another Vehicle Button */}
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    // Initialize with empty values
                                                                    const newVehicle = {
                                                                        ownershipType: '',
                                                                        relation: '',
                                                                        vehicleType: '',
                                                                        purchaseDate: '',
                                                                        insurance: '',
                                                                        insuranceExpiry: '',
                                                                        numberplatephoto: null,
                                                                        odometer: '',
                                                                    };

                                                                    // Initialize vehicles array if it doesn't exist
                                                                    if (!values.vehicles) {
                                                                        arrayHelpers.replace([newVehicle]);
                                                                    } else {
                                                                        arrayHelpers.push(newVehicle);
                                                                    }
                                                                }}
                                                                style={styles.buttonAdd}
                                                            >
                                                                <Text style={styles.buttonText}>+ Add Vehicle</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                />
                                            )}
                                        </View>
                                    )}

                                    {step === 9 && (//Preview
                                        <View style={{ padding: 10 }}>

                                            {/* personal details   */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('personaldetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Personal Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'personaldetails' && (
                                                    <View>
                                                        <Text style={styles.label}>
                                                            First Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.firstName} readOnly />

                                                        <Text style={styles.label}>
                                                            Middle Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.middleName} readOnly />

                                                        <Text style={styles.label}>
                                                            Last Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.lastName} readOnly />

                                                        <Text style={styles.label}>
                                                            Father First Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.fathersFirstName} readOnly />

                                                        <Text style={styles.label}>
                                                            Father Middle Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.fathersMiddleName} readOnly />

                                                        <Text style={styles.label}>
                                                            Father Last Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.fathersLastName} readOnly />

                                                        <Text style={styles.label}>
                                                            Mother First Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.mothersFirstName} readOnly />

                                                        <Text style={styles.label}>
                                                            Mother Middle Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.mothersMiddleName} readOnly />

                                                        <Text style={styles.label}>
                                                            Mother Last Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.mothersLastName} readOnly />

                                                        {/* Gender Field */}
                                                        <Text style={styles.label}>
                                                            Gender <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} readOnly value={values.gender} />
                                                        {values.gender === 'other' && (
                                                            <View>
                                                                <Text style={styles.label}>
                                                                    Please specify your gender <Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} readOnly value={values.customGender} />
                                                            </View>
                                                        )}

                                                        {/* Date of Birth */}
                                                        <Text style={styles.label}>
                                                            Date of Birth <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            editable={false}
                                                            value={
                                                                values.dateOfBirth
                                                                    ? new Date(values.dateOfBirth).toLocaleDateString('en-GB')
                                                                    : 'DD/MM/YYYY'
                                                            }
                                                        />

                                                        {/* Religion Field */}
                                                        <Text style={styles.label}>
                                                            Religion <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} readOnly value={values.religion} />
                                                        {values.religion === 'other' && (
                                                            <View>
                                                                <Text style={styles.label}>Please specify your religion:</Text>
                                                                <TextInput style={styles.input} readOnly value={values.customReligion} />
                                                            </View>
                                                        )}

                                                        {/* Blood Group Field */}
                                                        <Text style={styles.label}>Blood Group *</Text>
                                                        <TextInput style={styles.input} readOnly value={values.bloodGroup} />

                                                        {/* Nationality Field */}
                                                        <Text style={styles.label}>Nationality *</Text>
                                                        <TextInput style={styles.input} readOnly value={values.nationality} />

                                                        <Text style={styles.label}>Photo *</Text>
                                                        {values.photo && values.photo.uri ? (
                                                            <Image
                                                                source={{ uri: values.photo.uri }}
                                                                style={styles.photoPreview} // Ensure this style displays the image correctly
                                                            />
                                                        ) : (
                                                            <Text>No photo available</Text> // Optionally show a message or placeholder if no photo exists
                                                        )}
                                                    </View>
                                                )}

                                            </View>

                                            {/* Family Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('Familydetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Family Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'Familydetails' && (
                                                    <View>
                                                        <Text style={styles.label}>isMarried <Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={values.isMarried}
                                                            readOnly
                                                        />


                                                        {values.isMarried === 'yes' && (
                                                            <View>
                                                                <Text style={styles.label}>Spouse Name <Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.spouseFirstName}
                                                                />

                                                                <Text style={styles.label}>Spouse Middle Name <Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.spouseMiddleName}
                                                                />

                                                                <Text style={styles.label}>Spouse Last Name <Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.spouseLastName}
                                                                />

                                                                <Text style={styles.label}>Marriage Date<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.marriageDate}
                                                                />


                                                                <Text style={styles.label}>SVP Participant? <Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.isSVPParticipant}
                                                                />


                                                                {values.isSVPParticipant === 'yes' && (
                                                                    <View>
                                                                        <Text style={styles.label}>SVP Designation<Text style={{ color: 'red' }}>*</Text></Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.svpDesignation}
                                                                        />


                                                                        <Text style={styles.label}>Date of Joining<Text style={{ color: 'red' }}>*</Text></Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.svpDateOfJoining}
                                                                        />


                                                                        <Text style={styles.label}>svpLocation<Text style={{ color: 'red' }}>*</Text></Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.svpLocation}
                                                                        />

                                                                    </View>
                                                                )}
                                                                {(Array.isArray(values.otherFamilyMembers) && values.otherFamilyMembers.length > 0) && (

                                                                    <View>
                                                                        <Text style={styles.label}>Other Family Members:</Text>
                                                                        {values.otherFamilyMembers.map((member, index) => (
                                                                            <View key={index} style={styles.previewContainer}>
                                                                                <Text style={styles.label}>Member {index + 1} Name</Text>
                                                                                <TextInput
                                                                                    style={styles.input}
                                                                                    readOnly
                                                                                    value={member.name}
                                                                                />
                                                                                <Text style={styles.label}>relationToRelativearray</Text>
                                                                                <TextInput
                                                                                    style={styles.input}
                                                                                    readOnly
                                                                                    value={member.relationToRelativearray}
                                                                                />
                                                                                <Text style={styles.label}>DOB</Text>
                                                                                <TextInput
                                                                                    style={styles.input}
                                                                                    readOnly
                                                                                    value={member.dob}
                                                                                />
                                                                            </View>
                                                                        ))}




                                                                    </View>
                                                                )}

                                                            </View>
                                                        )}
                                                    </View>
                                                )}
                                            </View>

                                            {/* Academic Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('Academicdetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        AcademicDetails {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'Academicdetails' && (
                                                    <View>
                                                        <Text style={styles.label}>Education Level<Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput style={styles.input} value={values.schoolEducation} readOnly />

                                                        {values.schoolEducation === '9th to 12th' && (
                                                            <View>
                                                                <Text style={styles.label}>9th to 12th Standard <Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.standard}
                                                                />

                                                            </View>
                                                        )}

                                                        {values.schoolEducation === 'graduation' && (
                                                            <View>
                                                                <Text style={styles.label}>Graduation Field <Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.graduationField}
                                                                />

                                                            </View>
                                                        )}

                                                        {values.schoolEducation === 'PostGraduation' && (
                                                            <View>
                                                                <Text style={styles.label}>PostGraduation Field<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.postGraduationField}
                                                                />

                                                            </View>
                                                        )}

                                                        {values.schoolEducation === 'Diploma' && (
                                                            <View>
                                                                <Text style={styles.label}>Diploma Field <Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.diplomaField}
                                                                />

                                                            </View>
                                                        )}




                                                        <Text style={styles.label}>Any Certification <Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput style={styles.input} value={values.certification} readOnly />
                                                    </View>
                                                )}
                                            </View>

                                            {/* Communication Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('Cmmunicationdetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Communication Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'Cmmunicationdetails' && (
                                                    <View>
                                                        {/* State, District, Taluka, Village */}
                                                        <Text style={styles.label}>
                                                            State <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.state} readOnly />


                                                        {/* District Dropdown */}
                                                        <Text style={styles.label}>
                                                            District <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.district} readOnly />

                                                        {/* Taluka Dropdown */}
                                                        <Text style={styles.label}>
                                                            Taluka <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.taluka} readOnly />

                                                        {/* Village Dropdown */}
                                                        <Text style={styles.label}>
                                                            Village <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.village} readOnly />


                                                        <Text style={styles.label}>
                                                            Pincode <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            value={values.pincode}
                                                            readOnly
                                                        />

                                                        {/* House Address, Landmark, gramPanchayat */}
                                                        <Text style={styles.label}>
                                                            House Address <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.houseAddress}
                                                        />

                                                        <Text style={styles.label}>
                                                            Landmark<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.landmark}
                                                        />

                                                        <Text style={styles.label}>
                                                            gramPanchayat<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.gramPanchayat}
                                                        />
                                                        <Text style={styles.label}>
                                                            Email<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.email}
                                                        />

                                                        {/* Primary Phone Number */}
                                                        <Text style={styles.label}>
                                                            Primary Phone Number <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.primaryMobilerelationToRelativearray} readOnly />


                                                        {values.primaryMobilerelationToRelativearray === 'own' ? (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.primaryMobileNumber}
                                                                    />
                                                                </View>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Family Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.familyMobileNumber}
                                                                    />
                                                                </View>
                                                                <Text style={styles.label}>
                                                                    Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} value={values.familyrelationToRelativearray} readOnly />

                                                                {values.familyrelationToRelativearray === 'other' && (
                                                                    <View>
                                                                        <Text style={styles.label}>
                                                                            Specify relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.otherFamilyrelationToRelativearray}
                                                                        />
                                                                    </View>
                                                                )}
                                                            </>
                                                        )}


                                                        {/* Secondary Phone Number */}
                                                        <Text style={styles.label}>
                                                            Secondary Phone Number<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.secondaryPhoneType} readOnly />


                                                        {values.secondaryPhoneType === 'own' ? (
                                                            <View>
                                                                <Text style={styles.label}>
                                                                    Enter Secondary Phone Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.secondaryMobile}
                                                                    />
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Family Secondary Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.FamilysecondaryMobile}
                                                                    />
                                                                </View>
                                                                <Text style={styles.label}>
                                                                    Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} value={values.secondaryPhonerelationToRelativearray} readOnly />

                                                                {values.secondaryPhonerelationToRelativearray === 'other' && (
                                                                    <View>
                                                                        <Text style={styles.label}>
                                                                            Specify relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.secondaryPhonerelationToRelativearrayOther}
                                                                        />
                                                                    </View>
                                                                )}
                                                            </>
                                                        )}

                                                        {/* Emergency Contact Number */}
                                                        <Text style={styles.label}>
                                                            Emergency Contact Number<Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.emergencyPhoneType} readOnly />


                                                        {values.emergencyPhoneType === 'own' ? (
                                                            <View>
                                                                <Text style={styles.label}>
                                                                    Emergency Contact Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.emergencyContact}
                                                                    />
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            <>
                                                                <Text style={styles.label}>
                                                                    Family Emergency Mobile Number<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                                    <TextInput
                                                                        style={[styles.input, { flex: 1 }]}
                                                                        readOnly
                                                                        value={values.countryCode}
                                                                    />
                                                                    <TextInput
                                                                        style={[styles.input, { flex: 3 }]}
                                                                        readOnly
                                                                        value={values.FamilyemergencyContact}
                                                                    />
                                                                </View>
                                                                <Text style={styles.label}>
                                                                    Select relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} value={values.emergencyrelationToRelativearray} readOnly />

                                                                {values.emergencyrelationToRelativearray === 'other' && (
                                                                    <>
                                                                        <Text style={styles.label}>
                                                                            Specify the relationToRelativearray<Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput
                                                                            style={styles.input}
                                                                            readOnly
                                                                            value={values.otherEmergencyrelationToRelativearray}
                                                                        />
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </View>
                                                )}
                                            </View>

                                            {/* Legal Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('Legaldetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Legal Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'Legaldetails' && (
                                                    <View>
                                                        {/* PAN Card Details */}
                                                        <Text style={styles.label}>PAN Card Details<Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput style={styles.input} value={values.hasPAN} readOnly />

                                                        {values.hasPAN === 'yes' && (
                                                            <>
                                                                <Text style={styles.label}>PAN Card Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input} readOnly value={values.panNumber}
                                                                />

                                                                <Text style={styles.label}>Name on PAN Card<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.panName}
                                                                />

                                                            </>
                                                        )}

                                                        {/* Aadhar Card Details */}
                                                        <Text style={styles.label}>Aadhar Card Details<Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput style={styles.input} value={values.hasAadhar} readOnly />

                                                        {values.hasAadhar === 'yes' && (
                                                            <>
                                                                <Text style={styles.label}>Aadhar Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.aadharNumber}
                                                                />

                                                                <Text style={styles.label}>Name on Aadhar Card<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.aadharName}
                                                                />

                                                            </>
                                                        )}

                                                        {/* Driving License Details */}
                                                        <Text style={styles.label}>Driving License Details<Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput style={styles.input} value={values.hasDrivingLicense} readOnly />

                                                        {values.hasDrivingLicense === 'yes' && (
                                                            <>
                                                                <Text style={styles.label}>Driving License Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.licenseNumber}
                                                                />


                                                                <Text style={styles.label}>Name on Driving License<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.licenseName}
                                                                />


                                                                <Text style={styles.label}>
                                                                    Upload Driving License <Text style={{ color: 'red' }}>*</Text>
                                                                </Text>
                                                                <TextInput style={styles.input} value={values.licenseFile} readOnly />


                                                            </>
                                                        )}

                                                        {/* Ayushman Card Details */}
                                                        <Text style={styles.label}>Ayushman Card Details<Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput style={styles.input} value={values.hasAyushmanCard} readOnly />

                                                        {values.hasAyushmanCard === 'yes' && (
                                                            <>
                                                                <Text style={styles.label}>Ayushman Card Number<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.ayushmanNumber}
                                                                />


                                                                <Text style={styles.label}>ABHA Address<Text style={{ color: 'red' }}>*</Text></Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.abhaAddress}
                                                                />

                                                            </>
                                                        )}

                                                        {/* Pradhan Mantri Jan Arogya Yojna */}
                                                        <Text style={styles.label}>Pradhan Mantri Jan Arogya Yojna<Text style={{ color: 'red' }}>*</Text></Text>
                                                        <TextInput style={styles.input} value={values.hasPMJAY} readOnly />

                                                    </View>
                                                )}
                                            </View>

                                            {/* Social Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('Socialdetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Social Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'Socialdetails' && (
                                                    <View>
                                                        {/* Position Dropdown */}
                                                        <Text style={styles.label}>
                                                            Position
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.position} readOnly />

                                                        {values.position === 'other' && (
                                                            <>
                                                                <Text style={styles.label}>Specify Position</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.customposition}
                                                                />

                                                            </>
                                                        )}

                                                        {/* isBachatGatMember Sadsya */}
                                                        <Text style={styles.label}>isBachatGatMember Sadsya</Text>
                                                        <TextInput style={styles.input} value={values.isBachatGatMember} readOnly />

                                                        {values.isBachatGatMember === 'yes' && (
                                                            <>
                                                                <Text style={styles.label}>Name of Group</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.bachatGatGroupName}
                                                                />

                                                                <Text style={styles.label}>Number of People</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.bachatGatNumberOfPeople}
                                                                />


                                                                <Text style={styles.label}>Work Details</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.bachatGatWorkDetails}
                                                                />

                                                            </>
                                                        )}

                                                        {/* Krushi Group */}
                                                        <Text style={styles.label}>Krushi Group</Text>
                                                        <TextInput style={styles.input} value={values.isKrushiGroupMember} readOnly />

                                                        {values.isKrushiGroupMember === 'yes' && (
                                                            <>
                                                                <Text style={styles.label}>Name of Group</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.krushiGroupName}
                                                                />


                                                                <Text style={styles.label}>Number of People</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.krushiGroupNumberOfPeople}
                                                                />


                                                                <Text style={styles.label}>Work Details</Text>
                                                                <TextInput
                                                                    style={styles.input}
                                                                    readOnly
                                                                    value={values.krushiGroupWorkDetails}
                                                                />

                                                            </>
                                                        )}

                                                        {/* Other Income Source */}
                                                        <Text style={styles.label}>Other Income Source</Text>
                                                        <TextInput
                                                            style={styles.input}
                                                            readOnly
                                                            value={values.otherIncomeSource}
                                                        />

                                                    </View>
                                                )}
                                            </View>

                                            {/* Bank Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('Bankdetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Bank Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'Bankdetails' && (
                                                    <View>
                                                        {/* Bank Name */}
                                                        <Text style={styles.label}>
                                                            Bank Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.bankName} readOnly />

                                                        {/* Name on Bank Account */}
                                                        <Text style={styles.label}>
                                                            Name on Bank Passbook <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.nameOnBankAccount} readOnly />

                                                        {/* IFSC Code */}
                                                        <Text style={styles.label}>
                                                            IFSC Code <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.ifscCode} readOnly />


                                                        {/* Branch Name */}
                                                        <Text style={styles.label}>
                                                            Branch Name <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.bankBranch} readOnly />
                                                    </View>
                                                )}
                                            </View>

                                            {/* Conveyance Details */}
                                            <View>
                                                <TouchableOpacity onPress={() => toggleSection('conveyancedetails')}>
                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
                                                        Conveyance Details {expandedSection ? '▲' : '▼'}
                                                    </Text>
                                                </TouchableOpacity>
                                                {expandedSection === 'conveyancedetails' && (
                                                    <View>
                                                        <Text style={styles.label}>
                                                            Do you have a vehicle <Text style={{ color: 'red' }}>*</Text>
                                                        </Text>
                                                        <TextInput style={styles.input} value={values.ownVehicle} readOnly />
                                                        {values.ownVehicle === 'yes' && values.vehicles?.length > 0 && (
                                                            <View>

                                                                {values.vehicles.map((vehicle, index) => (
                                                                    <View key={index} style={styles.previewContainer}>
                                                                        <Text style={styles.label}>Vehicle {index + 1}</Text>
                                                                        <Text style={styles.label}>
                                                                            Ownership Type <Text style={{ color: 'red' }}>*</Text>
                                                                        </Text>
                                                                        <TextInput style={styles.input} value={vehicle.ownershipType} readOnly />
                                                                        {vehicle.ownershipType === 'relative' && (
                                                                            <View>
                                                                                <Text style={styles.label}>
                                                                                    relationToRelativearray <Text style={{ color: 'red' }}>*</Text>
                                                                                </Text>
                                                                                <TextInput style={styles.input} value={vehicle.relationToRelativearray} readOnly />
                                                                            </View>
                                                                        )}
                                                                        <View>
                                                                            <Text style={styles.label}>
                                                                                Vehicle Type<Text style={{ color: 'red' }}>*</Text>
                                                                            </Text>
                                                                            <TextInput style={styles.input} value={vehicle.vehicleType} readOnly />
                                                                        </View>
                                                                        <View>
                                                                            <Text style={styles.label}>
                                                                                Purchase Date<Text style={{ color: 'red' }}>*</Text>
                                                                            </Text>
                                                                            <TextInput style={styles.input} value={vehicle.purchaseDate} readOnly />
                                                                        </View>
                                                                        <View>
                                                                            <Text style={styles.label}>
                                                                                insuranceStatusarray<Text style={{ color: 'red' }}>*</Text>
                                                                            </Text>
                                                                            <TextInput style={styles.input} value={vehicle.insurance} readOnly />
                                                                        </View>
                                                                        {vehicle.insuranceStatusarray === 'yes' && (
                                                                            <View>
                                                                                <Text style={styles.label}>
                                                                                    insuranceStatusarray Expiry<Text style={{ color: 'red' }}>*</Text>
                                                                                </Text>
                                                                                <TextInput style={styles.input} value={vehicle.insuranceExpiry} readOnly />
                                                                            </View>
                                                                        )}
                                                                        <View>
                                                                            <Text style={styles.label}>
                                                                                odometerReadingarray Reading<Text style={{ color: 'red' }}>*</Text>
                                                                            </Text>
                                                                            <TextInput style={styles.input} value={vehicle.odometer} readOnly />
                                                                        </View>
                                                                    </View>
                                                                ))}
                                                            </View>
                                                        )}
                                                    </View>
                                                )}
                                            </View>

                                        </View>
                                    )}



                                    <View style={styles.buttonContainer}>
                                        {step > 0 && (
                                            <TouchableOpacity
                                                onPress={handlePrevious}
                                                style={[styles.button, styles.backButton]}>
                                                <Text style={styles.backButtonText}>Back</Text>
                                            </TouchableOpacity>
                                        )}
                                        {step < totalSteps ? (
                                            <TouchableOpacity
                                                onPress={() => handleNext(validateForm, setFieldTouched)}
                                                style={[styles.button, styles.nextButton]}>
                                                <Text style={styles.nextButtonText}>Next</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={handleSubmit}
                                                style={[styles.button, styles.nextButton]}>
                                                <Text style={styles.nextButtonText}>Submit</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* Date Picker Modal */}
                                    {datePickerVisible && (
                                        <DateTimePicker
                                            value={selectedDate}
                                            mode="date"
                                            display="default"
                                            onChange={(event, date) => onDateChange(event, date, setFieldValue)}
                                        />
                                    )}

                                </View>
                            )
                        }}
                    </Formik>


                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: '120%',
        backgroundColor: 'white',
    },
    indicatorContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    stepIndicator: {
        width: 35,
        height: 35,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#E7E7E7',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStep: {
        borderColor: 'pink',
        backgroundColor: 'pink',
    },
    stepText: {
        color: '#E7E7E7',
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeStepText: {
        color: 'white',
    },
    line: {
        width: 20,
        height: 2,
        backgroundColor: '#E7E7E7',
        marginHorizontal: 5,
    },
    activeLine: {
        backgroundColor: 'pink',
    },
    stepName: {
        marginTop: 5,
        fontSize: 12,
        color: '#888',
    },
    activeStepName: {
        color: 'orange',
        fontWeight: 'bold',
    },

    progressBarContainer: {
        height: 30,
        width: '100%',
        backgroundColor: '#f3f3f3',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    percentageText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        color: 'black',
    },

    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: hp('10%'),
    },
    backButton: {
        backgroundColor: '#E7E7E7',
        marginRight: 10,
    },
    backButtonText: {
        color: 'gray',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 10
    },
    nextButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    label: {
        fontSize: hp('2%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: hp('1.5%'),
        marginBottom: hp('2%'),
        fontSize: hp('2%'),
        color: 'black',
        backgroundColor: '#D9D9D9',
    },
    removeIcon: {

        padding: 5,
        backgroundColor: '#FFCCCC',
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 20,
        height: 20,
    },
    iconText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#D9D9D9',
        color: 'black'
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#aaa',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#333',
    },
    itemTextStyle: {
        color: 'black', // Dropdown options color
        fontSize: 16,
    },

    datePickerText: {
        textAlign: 'center',
        fontSize: hp('2%'),
        color: 'black',
    },

    imagePicker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: hp('1.5%'),
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    image: {
        width: wp('20%'),
        height: wp('20%'),
        alignSelf: 'center',
        marginBottom: hp('2%'),
    },
    photoPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderColor: '#ccc',
        alignSelf: 'center',
        borderWidth: 1,
    },
    error: {
        color: 'red',
        fontSize: hp('1.5%'),
        marginBottom: hp('2%'),
    },
    imageOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    optionButton: {
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    buttonAdd: {
        borderColor: 'orange',
        borderWidth: 1,
        padding: 12,
        marginVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'orange',
        fontSize: 16,
    },
    cancelIcon: {
        backgroundColor: '#ff4d4d',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ownershipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    skillHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 5,
    },
    skillHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: 'black',
        fontSize: 10
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    languageColumn: {
        flex: 2,
        color: 'black',
        fontSize: 16,
    },
    checkbox: {
        flex: 1,
        alignSelf: 'center',
        borderColor: 'black'
    },
    otherLanguageInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    fileInfo: {
        marginTop: 10,
        color: 'gray',
    },
    uploadButton: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
    },
    uploadButtonText: {
        color: 'gray',
        fontWeight: 'bold',
    },
    fileName: {
        marginTop: 10,
        fontSize: 14,
        color: '#333',
    },

});


export default UpdateKifScreen