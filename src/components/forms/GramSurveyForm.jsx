
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
  Pressable,
  ScrollView
} from 'react-native';


import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import { API_BASE_URL } from '../../constant/Constatnt';
import { Dropdown } from 'react-native-element-dropdown';

const GramSurveyForm = () => {


  const [progress, setProgress] = useState(0);

  const [expandedSection, setExpandedSection] = useState('personaldetails'); // State to track expanded section

  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [formValues, setFormValues] = useState({ initialFormValues });
  const [activeStep, setActiveStep] = useState(1);

  const toggleStep = (stepNumber) => {
    setActiveStep((prevStep) => (prevStep === stepNumber ? null : stepNumber));
  };



  const handleNext = async (validateForm, setFieldTouched) => {
    // Trigger validation for the current step
    const errors = await validateForm();
    await validateForm(); // Ensure validation runs
    setFieldTouched(); // Mark fields as touched
    toggleStep(activeStep + 1);
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

  const handlePrevious = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const calculateProgress = (values) => {
    const totalFields = [
      // Step 1: Village Info
      'village',
      'gramPanchayat',
      'taluka',
      'district',
      'pinCode',

      // Step 2: Population
      'males',
      'females',
      'houses',
      'families',
      'studentGirls6to8',
      'studentBoys6to8',
      'totalPopulation',

      // Step 3: Government Schools
      'hasGovtSchool',
      'govtSchoolName',
      'govtSchoolCategory',
      'govtSchoolMedium',
      'govtStudentsGirls',
      'govtStudentsBoys',
      'govtStudentsClass4',
      'govtStudentsClass5',
      'govtStudentsClass8',
      'govtStudentsClass10',
      'govtPrincipalName',
      'govtPrincipalContact',
      'govtSmcMemberName',
      'govtSmcMemberContact',

      // Step 4: Private Schools
      'hasPrivateSchools',
      'privateSchoolName',
      'privateSchoolCategory',
      'privateSchoolMedium',
      'privateSchoolGirlStudents',
      'privateSchoolBoyStudents',
      'privateSchoolStudentsIn4thClass',
      'privateSchoolStudentsIn5thClass',
      'privateSchoolStudentsIn8thClass',
      'privateSchoolStudentsIn10thClass',
      'privateSchoolPrincipalName',
      'privateSchoolPrincipalContactNumber',
      'privateSchoolSmcMemberName',
      'privateSchoolSmcMemberContactNumber',

      // Step 5: Ashramshala
      'hasAshramshala',
      'ashramshalaName',
      'ashramshalaCategory',
      'ashramshalaMedium',
      'ashramshalaGirlStudents',
      'ashramshalaBoyStudents',
      'ashramshalaStudentsIn4thClass',
      'ashramshalaStudentsIn5thClass',
      'ashramshalaStudentsIn8thClass',
      'ashramshalaStudentsIn10thClass',
      'ashramshalaPrincipalName',
      'ashramshalaPrincipalContactNumber',
      'ashramshalaSmcMemberName',
      'ashramshalaSmcMemberContactNumber'
    ];


    const filledFields = totalFields.filter((field) => {
      const value = values[field];
      return value !== undefined && value !== null && value !== ''; // Check for non-empty values
    }).length;

    return Math.round((filledFields / totalFields.length) * 100);
  };


  const validationSchema = [
    // Yup.object().shape({
    //   village: Yup.string()
    //     .required('Village name is required')
    //     .matches(/^[A-Za-z\s]+$/, 'Village name must contain only letters')
    //     .min(2, 'Village name must be at least 2 characters'),
    //   gramPanchayat: Yup.string()
    //     .required('gramPanchayat name is required')
    //     .matches(/^[A-Za-z\s]+$/, 'gramPanchayat name must contain only letters')
    //     .min(2, 'gramPanchayat name must be at least 2 characters'),
    //   taluka: Yup.string()
    //     .required('Taluka name is required')
    //     .matches(/^[A-Za-z\s]+$/, 'Taluka name must contain only letters')
    //     .min(2, 'Taluka name must be at least 2 characters'),
    //   district: Yup.string()
    //     .required('District name is required')
    //     .matches(/^[A-Za-z\s]+$/, 'District name must contain only letters')
    //     .min(2, 'District name must be at least 2 characters'),
    //   pinCode: Yup.string()
    //     .required('Pin code is required')
    //     .matches(/^\d{6}$/, 'Pin code must be exactly 6 digits')
    // }),

    // Yup.object().shape({
    //   males: Yup.number()
    //     .required('Number of males is required')
    //     .positive('Number of males must be a positive number')
    //     .integer('Number of males must be a whole number')
    //     .typeError('Number of males must be a number'),
    //   females: Yup.number()
    //     .required('Number of females is required')
    //     .positive('Number of females must be a positive number')
    //     .integer('Number of females must be a whole number')
    //     .typeError('Number of females must be a number'),
    //   houses: Yup.number()
    //     .required('Number of houses is required')
    //     .positive('Number of houses must be a positive number')
    //     .integer('Number of houses must be a whole number')
    //     .typeError('Number of houses must be a number'),
    //   families: Yup.number()
    //     .required('Number of families is required')
    //     .positive('Number of families must be a positive number')
    //     .integer('Number of families must be a whole number')
    //     .typeError('Number of families must be a number'),
    //   studentGirls6to8: Yup.number()
    //     .required('Number of girls from 6th to 8th is required')
    //     .positive('Number of girls must be a positive number')
    //     .integer('Number of girls must be a whole number')
    //     .typeError('Number of girls must be a number'),
    //   studentBoys6to8: Yup.number()
    //     .required('Number of boys from 6th to 8th is required')
    //     .positive('Number of boys must be a positive number')
    //     .integer('Number of boys must be a whole number')
    //     .typeError('Number of boys must be a number'),
    //   totalPopulation: Yup.number()
    //     .required('Total population is required')
    //     .positive('Total population must be a positive number')
    //     .integer('Total population must be a whole number')
    //     .typeError('Total population must be a number')
    // }),

    // Yup.object().shape({
    //   hasGovtSchool: Yup.boolean()
    //     .nullable()
    //     .required('Please select an option'),

    //   govtSchoolCategory: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('School category is required')
    //       .min(2, 'School category must be at least 2 characters'),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtSchoolMedium: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Medium of education is required')
    //       .oneOf(['Marathi', 'Hindi', 'English', 'Semi-English'], 'Please select a valid medium'),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtSchoolName: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('School name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'School name must contain only letters')
    //       .min(3, 'School name must be at least 3 characters'),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtPrincipalName: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Principal name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'Principal name must contain only letters')
    //       .min(3, 'Principal name must be at least 3 characters'),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtSmcMemberName: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('SMC member name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'SMC member name must contain only letters')
    //       .min(3, 'SMC member name must be at least 3 characters'),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtStudentsGirls: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Number of girl students is required')
    //       .test(
    //         'is-positive-number',
    //         'Number of girl students must be a positive number',
    //         value => !isNaN(value) && parseInt(value) > 0
    //       ),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtStudentsBoys: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Number of boy students is required')
    //       .test(
    //         'is-positive-number',
    //         'Number of boy students must be a positive number',
    //         value => !isNaN(value) && parseInt(value) > 0
    //       ),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtStudentsClass4: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Number of students in 4th class is required')
    //       .test(
    //         'is-positive-number',
    //         'Number must be a positive number',
    //         value => !isNaN(value) && parseInt(value) > 0
    //       ),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtStudentsClass5: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Number of students in 5th class is required')
    //       .test(
    //         'is-positive-number',
    //         'Number must be a positive number',
    //         value => !isNaN(value) && parseInt(value) > 0
    //       ),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtStudentsClass8: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Number of students in 8th class is required')
    //       .test(
    //         'is-positive-number',
    //         'Number must be a positive number',
    //         value => !isNaN(value) && parseInt(value) > 0
    //       ),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtStudentsClass10: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Number of students in 10th class is required')
    //       .test(
    //         'is-positive-number',
    //         'Number must be a positive number',
    //         value => !isNaN(value) && parseInt(value) > 0
    //       ),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtPrincipalContact: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('Principal contact number is required')
    //       .matches(/^[1-9]\d{9}$/, 'Invalid mobile number'),
    //     otherwise: () => Yup.string().notRequired(),
    //   }),

    //   govtSmcMemberContact: Yup.string().when('hasGovtSchool', {
    //     is: true,
    //     then: () => Yup.string()
    //       .required('SMC member contact number is required')
    //       .matches(/^[1-9]\d{9}$/, 'Invalid mobile number'),
    //     otherwise: () => Yup.string().notRequired(),
    //   })
    // }),
    // Yup.object().shape({
    //   hasPrivateSchools: Yup.string()
    //     .required('Please select an option'),
    //   privateSchoolName: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('School name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'School name must contain only letters')
    //       .min(3, 'School name must be at least 3 characters')
    //   }),
    //   privateSchoolCategory: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('School category is required')
    //   }),
    //   privateSchoolMedium: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Medium of education is required')
    //   }),
    //   privateSchoolPrincipalName: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Principal name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'Principal name must contain only letters')
    //       .min(3, 'Principal name must be at least 3 characters')
    //   }),
    //   privateSchoolSmcMemberName: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('SMC member name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'SMC member name must contain only letters')
    //       .min(3, 'SMC member name must be at least 3 characters')
    //   }),
    //   privateSchoolGirlStudents: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Number of girl students is required')
    //       .matches(/^\d+$/, 'Number of girl students must contain only digits')
    //       .test(
    //         'positive-number',
    //         'Number of girl students must be a positive number',
    //         value => parseInt(value, 10) > 0
    //       )
    //   }),
    //   privateSchoolBoyStudents: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Number of boy students is required')
    //       .matches(/^\d+$/, 'Number of boy students must contain only digits')
    //       .test(
    //         'positive-number',
    //         'Number of boy students must be a positive number',
    //         value => parseInt(value, 10) > 0
    //       )
    //   }),
    //   privateSchoolPrincipalContactNumber: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Principal contact number is required')
    //       .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    //   }),
    //   privateSchoolSmcMemberContactNumber: Yup.string().when('hasPrivateSchools', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('SMC member contact number is required')
    //       .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    //   }),
    //   // Optional fields
    //   privateSchoolStudentsIn4thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits'),
    //   privateSchoolStudentsIn5thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits'),
    //   privateSchoolStudentsIn8thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits'),
    //   privateSchoolStudentsIn10thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits')
    // }),
    // Yup.object().shape({
    //   hasAshramshala: Yup.string()
    //     .required('Please select an option'),
    //   ashramshalaName: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('School name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'School name must contain only letters')
    //       .min(3, 'School name must be at least 3 characters')
    //   }),
    //   ashramshalaCategory: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('School category is required')
    //   }),
    //   ashramshalaMedium: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Medium of education is required')
    //   }),
    //   ashramshalaGirlStudents: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Number of girl students is required')
    //       .matches(/^\d+$/, 'Number of girl students must contain only digits')
    //       .test(
    //         'positive-number',
    //         'Number of girl students must be a positive number',
    //         value => parseInt(value, 10) > 0
    //       )
    //   }),
    //   ashramshalaBoyStudents: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Number of boy students is required')
    //       .matches(/^\d+$/, 'Number of boy students must contain only digits')
    //       .test(
    //         'positive-number',
    //         'Number of boy students must be a positive number',
    //         value => parseInt(value, 10) > 0
    //       )
    //   }),
    //   ashramshalaPrincipalName: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Principal name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'Principal name must contain only letters')
    //       .min(3, 'Principal name must be at least 3 characters')
    //   }),
    //   ashramshalaPrincipalContactNumber: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('Principal contact number is required')
    //       .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    //   }),
    //   ashramshalaSmcMemberName: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('SMC member name is required')
    //       .matches(/^[A-Za-z\s]+$/, 'SMC member name must contain only letters')
    //       .min(3, 'SMC member name must be at least 3 characters')
    //   }),
    //   ashramshalaSmcMemberContactNumber: Yup.string().when('hasAshramshala', {
    //     is: 'yes',
    //     then:()=> Yup.string()
    //       .required('SMC member contact number is required')
    //       .matches(/^[6-9]\d{9}$/, 'Invalid mobile number')
    //   }),
    //   // Optional class-specific student counts
    //   ashramshalaStudentsIn4thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits'),
    //   ashramshalaStudentsIn5thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits'),
    //   ashramshalaStudentsIn8thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits'),
    //   ashramshalaStudentsIn10thClass: Yup.string()
    //     .matches(/^\d*$/, 'Must contain only digits')
    // }),
    // Yup.object().shape({
    //   formConfirmed: Yup.boolean()
    //     .oneOf([true], 'Please confirm the form details')
    // })

  ];

  const stepNames = ['Location', 'Population', 'Goverment', 'Private', 'Aashramshala', 'Preview'];

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

  const initialFormValues = {
    // Step trackers


    // Government Schools section - Step 3
    hasGovtSchool: null,
    govtSchoolCategory: '',
    govtSchoolMedium: '',
    govtSchoolName: '',
    govtStudentsGirls: '',
    govtStudentsBoys: '',
    govtStudentsClass4: '',
    govtStudentsClass5: '',
    govtStudentsClass8: '',
    govtStudentsClass10: '',
    govtPrincipalName: '',
    govtPrincipalContact: '',
    govtSmcMemberName: '',
    govtSmcMemberContact: '',

    // Private Schools section - Assuming similar fields for step 4
    hasPrivateSchools: null,
    privateSchoolCategory: '',
    privateSchoolMedium: '',
    privateSchoolName: '',
    privateSchoolGirlStudents: '',
    privateSchoolBoyStudents: '',
    privateSchoolStudentsIn4thClass: '',
    privateSchoolStudentsIn5thClass: '',
    privateSchoolStudentsIn8thClass: '',
    privateSchoolStudentsIn10thClass: '',
    privateSchoolPrincipalName: '',
    privateSchoolPrincipalContactNumber: '',
    privateSchoolSmcMemberName: '',
    privateSchoolSmcMemberContactNumber: '',

    // Ashramshala section - Assuming similar fields for step 5
    hasAshramshala: null,
    ashramshalaSchoolCategory: '',
    ashramshalaSchoolMedium: '',
    ashramshalaName: '',
    ashramshalaSchoolGirlStudents: '',
    ashramshalaSchoolBoyStudents: '',
    ashramshalaSchoolStudentsIn4thClass: '',
    ashramshalaSchoolStudentsIn5thClass: '',
    ashramshalaSchoolStudentsIn8thClass: '',
    ashramshalaSchoolStudentsIn10thClass: '',
    ashramshalaSchoolPrincipalName: '',
    ashramshalaSchoolPrincipalContactNumber: '',
    ashramshalaSchoolSmcMemberName: '',
    ashramshalaSchoolSmcMemberContactNumber: '',

    // Additional required fields from schema
    surveyer: '',
    village: '',
    gramPanchayat: '',
    taluka: '',
    district: '',
    pinCode: '',

    // Population data as direct fields to match your approach
    populationMales: '',
    populationFemales: '',
    populationTotal: '',
    houses: '',
    families: '',
    total:'',

    // Additional fields
    sixtoeightstudentsBoys: '',
    sixtoeightstudentsGirls: '',
  };

  // Helper function to transform form values to match backend schema before submission
  const prepareFormDataForSubmission = (values) => {
    return {
      surveyer: values.surveyer,
      village: values.village,
      gramPanchayat: values.gramPanchayat,
      taluka: values.taluka,
      district: values.district,
      pinCode: values.pinCode,

      population: {
        males: Number(values.males) || 0,
        females: Number(values.females) || 0,
        total: Number(values.totalPopulation) || 0
      },

      houses: Number(values.houses) || 0,
      families: Number(values.families) || 0,

      // Transform government schools data
      govtSchools: {
        exists: values.hasGovtSchool === true,
        schools: values.hasGovtSchool === true ? [
          {
            name: values.govtSchoolName,
            category: values.govtSchoolCategory,
            medium: values.govtSchoolMedium,
            students: {
              boys: Number(values.govtStudentsBoys) || 0,
              girls: Number(values.govtStudentsGirls) || 0,
              class4: Number(values.govtStudentsClass4) || 0,
              class5: Number(values.govtStudentsClass5) || 0,
              class8: Number(values.govtStudentsClass8) || 0,
              class10: Number(values.govtStudentsClass10) || 0
            },
            principal: {
              name: values.govtPrincipalName,
              contactNo: values.govtPrincipalContact
            },
            smcMember: {
              name: values.govtSmcMemberName,
              contactNo: values.govtSmcMemberContact
            }
          }
        ] : []
      },

      // Transform private schools data
      pvtSchools: {
        exists: values.hasPrivateSchools === true,
        schools: values.hasPrivateSchools === true ? [
          {
            name: values.privateSchoolName,
            category: values.privateSchoolCategory,
            medium: values.privateSchoolMedium,
            students: {
              boys: Number(values.privateSchoolBoyStudents) || 0,
              girls: Number(values.privateSchoolGirlStudents) || 0,
              class4: Number(values.privateSchoolStudentsIn4thClass) || 0,
              class5: Number(values.privateSchoolStudentsIn5thClass) || 0,
              class8: Number(values.privateSchoolStudentsIn8thClass) || 0,
              class10: Number(values.privateSchoolStudentsIn10thClass) || 0
            },
            principal: {
              name: values.privateSchoolPrincipalName,
              contactNo: values.privateSchoolPrincipalContactNumber
            },
            smcMember: {
              name: values.privateSchoolSmcMemberName,
              contactNo: values.privateSchoolSmcMemberContactNumber
            }
          }
        ] : []
      },

      // Transform ashramshala data
      ashramshala: {
        exists: values.hasAshramshala === true,
        schools: values.hasAshramshala === true ? [
          {
            name: values.ashramshalaName,
            category: values.ashramshalaSchoolCategory,
            medium: values.ashramshalaSchoolMedium,
            students: {
              boys: Number(values.ashramshalaSchoolBoyStudents) || 0,
              girls: Number(values.ashramshalaSchoolGirlStudents) || 0,
              class4: Number(values.ashramshalaSchoolStudentsIn4thClass) || 0,
              class5: Number(values.ashramshalaSchoolStudentsIn5thClass) || 0,
              class8: Number(values.ashramshalaSchoolStudentsIn8thClass) || 0,
              class10: Number(values.ashramshalaSchoolStudentsIn10thClass) || 0
            },
            principal: {
              name: values.ashramshalaSchoolPrincipalName,
              contactNo: values.ashramshalaSchoolPrincipalContactNumber
            },
            smcMember: {
              name: values.ashramshalaSchoolSmcMemberName,
              contactNo: values.ashramshalaSchoolSmcMemberContactNumber
            }
          }
        ] : []
      },

      sixtoeightstudentsankhya: {
        boys: Number(values.studentBoys6to8) || 0,
        girls: Number(values.studentGirls6to8) || 0
      }
    };
  };
  // Form submission handler
  const handleSubmitform = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepare the data according to the backend schema
      const formattedData = prepareFormDataForSubmission(values);

      console.log('Submitting data:', formattedData); // Log the data being sent

      // Make API request to create survey
      const response = await fetch(`${API_BASE_URL}/api/v1/gram-survey/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      // Log the raw response before parsing
      console.log('Response status:', response.status);

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        // Handle successful submission
        alert('Survey submitted successfully!');
        resetForm();
      } else {
        // Handle validation or other errors from the server
        const errorMessage = Array.isArray(result.error)
          ? result.error.join(', ')
          : result.error || 'Failed to submit survey';
        console.error('Submission error:', errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      // More detailed error logging
      console.error('Error submitting form:', error.message || error);
      alert(`Failed to submit survey: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
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
            onSubmit={handleSubmitform}>
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


              }, [setFieldValue]);

              return (
                <View>

                  {step === 1 && ( // Location Details
                    <View>
                      <Text style={styles.label}>Village <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Village Name"
                        placeholderTextColor="gray"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('village')}
                        onBlur={handleBlur('village')}
                        value={values.village}
                      />
                      {touched.village && errors.village && (
                        <Text style={styles.error}>{errors.village}</Text>
                      )}

                      <Text style={styles.label}>gramPanchayat <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter gramPanchayat Name"
                        placeholderTextColor="gray"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('gramPanchayat')}
                        onBlur={handleBlur('gramPanchayat')}
                        value={values.gramPanchayat}
                      />
                      {touched.gramPanchayat && errors.gramPanchayat && (
                        <Text style={styles.error}>{errors.gramPanchayat}</Text>
                      )}

                      <Text style={styles.label}>Taluka <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Taluka Name"
                        placeholderTextColor="gray"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('taluka')}
                        onBlur={handleBlur('taluka')}
                        value={values.taluka}
                      />
                      {touched.taluka && errors.taluka && (
                        <Text style={styles.error}>{errors.taluka}</Text>
                      )}

                      <Text style={styles.label}>District <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter District Name"
                        placeholderTextColor="gray"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('district')}
                        onBlur={handleBlur('district')}
                        value={values.district}
                      />
                      {touched.district && errors.district && (
                        <Text style={styles.error}>{errors.district}</Text>
                      )}

                      <Text style={styles.label}>Pin Code <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Pin Code"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        maxLength={6}
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('pinCode')}
                        onBlur={handleBlur('pinCode')}
                        value={values.pinCode}
                      />
                      {touched.pinCode && errors.pinCode && (
                        <Text style={styles.error}>{errors.pinCode}</Text>
                      )}
                    </View>
                  )}

                  {step === 2 && ( // Population Details
                    <View>
                      <Text style={styles.label}>Number of Males <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Number of Males"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('males')}
                        onBlur={handleBlur('males')}
                        value={values.males}
                      />
                      {touched.males && errors.males && (
                        <Text style={styles.error}>{errors.males}</Text>
                      )}

                      <Text style={styles.label}>Number of Females <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Number of Females"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('females')}
                        onBlur={handleBlur('females')}
                        value={values.females}
                      />
                      {touched.females && errors.females && (
                        <Text style={styles.error}>{errors.females}</Text>
                      )}

                      <Text style={styles.label}>Number of Houses <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Number of Houses"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('houses')}
                        onBlur={handleBlur('houses')}
                        value={values.houses}
                      />
                      {touched.houses && errors.houses && (
                        <Text style={styles.error}>{errors.houses}</Text>
                      )}

                      <Text style={styles.label}>Number of Families <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Number of Families"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('families')}
                        onBlur={handleBlur('families')}
                        value={values.families}
                      />
                      {touched.families && errors.families && (
                        <Text style={styles.error}>{errors.families}</Text>
                      )}

                      <Text style={styles.label}>Number of Student Girls (6th to 8th) <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Number of Girls from 6th to 8th"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('studentGirls6to8')}
                        onBlur={handleBlur('studentGirls6to8')}
                        value={values.studentGirls6to8}
                      />
                      {touched.studentGirls6to8 && errors.studentGirls6to8 && (
                        <Text style={styles.error}>{errors.studentGirls6to8}</Text>
                      )}

                      <Text style={styles.label}>Number of Student Boys (6th to 8th) <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Number of Boys from 6th to 8th"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('studentBoys6to8')}
                        onBlur={handleBlur('studentBoys6to8')}
                        value={values.studentBoys6to8}
                      />
                      {touched.studentBoys6to8 && errors.studentBoys6to8 && (
                        <Text style={styles.error}>{errors.studentBoys6to8}</Text>
                      )}

                      <Text style={styles.label}>Total Population <Text style={{ color: 'red' }}>*</Text></Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Total Population"
                        placeholderTextColor="gray"
                        keyboardType="numeric"
                        onChangeText={handleChangeWithTouch(
                          setFieldValue,
                          setFieldTouched,
                        )('totalPopulation')}
                        onBlur={handleBlur('totalPopulation')}
                        value={values.totalPopulation}
                      />
                      {touched.totalPopulation && errors.totalPopulation && (
                        <Text style={styles.error}>{errors.totalPopulation}</Text>
                      )}
                    </View>
                  )}

                  {step === 3 && ( // Government Schools Details
                    <View>
                      <Text style={styles.label}>Are there Government Schools? <Text style={{ color: 'red' }}>*</Text></Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={[
                          { label: 'Select', value: null },
                          { label: 'Yes', value: true },
                          { label: 'No', value: false }
                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder="Select"
                        value={values.hasGovtSchool}
                        onChange={(item) => {
                          setFieldValue('hasGovtSchool', item.value);
                          setFieldTouched('hasGovtSchool', true);


                        }}
                      />
                      {touched.hasGovtSchool && errors.hasGovtSchool && (
                        <Text style={styles.error}>{errors.hasGovtSchool}</Text>
                      )}

                      {values.hasGovtSchool === true && (
                        <>
                          <Text style={styles.label}>Category of School <Text style={{ color: 'red' }}>*</Text></Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                              { label: 'Select Category', value: '' },
                              { label: 'Primary', value: 'primary' },
                              { label: 'Secondary', value: 'secondary' },
                              { label: 'Higher Secondary', value: 'higherSecondary' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Category"
                            value={values.govtSchoolCategory}
                            onChange={(item) => {
                              setFieldValue('govtSchoolCategory', item.value);
                              setFieldTouched('govtSchoolCategory', true);
                            }}
                          />
                          {touched.govtSchoolCategory && errors.govtSchoolCategory && (
                            <Text style={styles.error}>{errors.govtSchoolCategory}</Text>
                          )}

                          <Text style={styles.label}>Medium of Education <Text style={{ color: 'red' }}>*</Text></Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                              { label: 'Select Medium', value: '' },
                              { label: 'Marathi', value: 'Marathi' },
                              { label: 'Hindi', value: 'Hindi' },
                              { label: 'English', value: 'English' },
                              { label: 'Semi-English', value: 'Semi-English' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Medium"
                            value={values.govtSchoolMedium}
                            onChange={(item) => {
                              setFieldValue('govtSchoolMedium', item.value);
                              setFieldTouched('govtSchoolMedium', true);
                            }}
                          />
                          {touched.govtSchoolMedium && errors.govtSchoolMedium && (
                            <Text style={styles.error}>{errors.govtSchoolMedium}</Text>
                          )}

                          <Text style={styles.label}>Name of School <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter School Name"
                            placeholderTextColor="gray"
                            onChangeText={(text) => {
                              setFieldValue('govtSchoolName', text);
                              setFieldTouched('govtSchoolName', true);
                            }}
                            onBlur={() => setFieldTouched('govtSchoolName', true)}
                            value={values.govtSchoolName}
                          />
                          {touched.govtSchoolName && errors.govtSchoolName && (
                            <Text style={styles.error}>{errors.govtSchoolName}</Text>
                          )}

                          <Text style={styles.label}>Number of Students (Girls) <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Girl Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setFieldValue('govtStudentsGirls', text);
                              setFieldTouched('govtStudentsGirls', true);
                            }}
                            onBlur={() => setFieldTouched('govtStudentsGirls', true)}
                            value={values.govtStudentsGirls}
                          />
                          {touched.govtStudentsGirls && errors.govtStudentsGirls && (
                            <Text style={styles.error}>{errors.govtStudentsGirls}</Text>
                          )}

                          <Text style={styles.label}>Number of Students (Boys) <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Boy Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setFieldValue('govtStudentsBoys', text);
                              setFieldTouched('govtStudentsBoys', true);
                            }}
                            onBlur={() => setFieldTouched('govtStudentsBoys', true)}
                            value={values.govtStudentsBoys}
                          />
                          {touched.govtStudentsBoys && errors.govtStudentsBoys && (
                            <Text style={styles.error}>{errors.govtStudentsBoys}</Text>
                          )}

                          <Text style={styles.label}>Students in 4th Class <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 4th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setFieldValue('govtStudentsClass4', text);
                              setFieldTouched('govtStudentsClass4', true);
                            }}
                            onBlur={() => setFieldTouched('govtStudentsClass4', true)}
                            value={values.govtStudentsClass4}
                          />
                          {touched.govtStudentsClass4 && errors.govtStudentsClass4 && (
                            <Text style={styles.error}>{errors.govtStudentsClass4}</Text>
                          )}

                          <Text style={styles.label}>Students in 5th Class <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 5th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setFieldValue('govtStudentsClass5', text);
                              setFieldTouched('govtStudentsClass5', true);
                            }}
                            onBlur={() => setFieldTouched('govtStudentsClass5', true)}
                            value={values.govtStudentsClass5}
                          />
                          {touched.govtStudentsClass5 && errors.govtStudentsClass5 && (
                            <Text style={styles.error}>{errors.govtStudentsClass5}</Text>
                          )}

                          <Text style={styles.label}>Students in 8th Class <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 8th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setFieldValue('govtStudentsClass8', text);
                              setFieldTouched('govtStudentsClass8', true);
                            }}
                            onBlur={() => setFieldTouched('govtStudentsClass8', true)}
                            value={values.govtStudentsClass8}
                          />
                          {touched.govtStudentsClass8 && errors.govtStudentsClass8 && (
                            <Text style={styles.error}>{errors.govtStudentsClass8}</Text>
                          )}

                          <Text style={styles.label}>Students in 10th Class <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 10th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setFieldValue('govtStudentsClass10', text);
                              setFieldTouched('govtStudentsClass10', true);
                            }}
                            onBlur={() => setFieldTouched('govtStudentsClass10', true)}
                            value={values.govtStudentsClass10}
                          />
                          {touched.govtStudentsClass10 && errors.govtStudentsClass10 && (
                            <Text style={styles.error}>{errors.govtStudentsClass10}</Text>
                          )}

                          <Text style={styles.label}>Name of Principal <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Principal's Name"
                            placeholderTextColor="gray"
                            onChangeText={(text) => {
                              setFieldValue('govtPrincipalName', text);
                              setFieldTouched('govtPrincipalName', true);
                            }}
                            onBlur={() => setFieldTouched('govtPrincipalName', true)}
                            value={values.govtPrincipalName}
                          />
                          {touched.govtPrincipalName && errors.govtPrincipalName && (
                            <Text style={styles.error}>{errors.govtPrincipalName}</Text>
                          )}

                          <Text style={styles.label}>Principal's Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Principal's Contact Number"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={(text) => {
                              setFieldValue('govtPrincipalContact', text);
                              setFieldTouched('govtPrincipalContact', true);
                            }}
                            onBlur={() => setFieldTouched('govtPrincipalContact', true)}
                            value={values.govtPrincipalContact}
                          />
                          {touched.govtPrincipalContact && errors.govtPrincipalContact && (
                            <Text style={styles.error}>{errors.govtPrincipalContact}</Text>
                          )}

                          <Text style={styles.label}>SMC Member Name <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter SMC Member's Name"
                            placeholderTextColor="gray"
                            onChangeText={(text) => {
                              setFieldValue('govtSmcMemberName', text);
                              setFieldTouched('govtSmcMemberName', true);
                            }}
                            onBlur={() => setFieldTouched('govtSmcMemberName', true)}
                            value={values.govtSmcMemberName}
                          />
                          {touched.govtSmcMemberName && errors.govtSmcMemberName && (
                            <Text style={styles.error}>{errors.govtSmcMemberName}</Text>
                          )}

                          <Text style={styles.label}>SMC Member Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter SMC Member's Contact Number"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={(text) => {
                              setFieldValue('govtSmcMemberContact', text);
                              setFieldTouched('govtSmcMemberContact', true);
                            }}
                            onBlur={() => setFieldTouched('govtSmcMemberContact', true)}
                            value={values.govtSmcMemberContact}
                          />
                          {touched.govtSmcMemberContact && errors.govtSmcMemberContact && (
                            <Text style={styles.error}>{errors.govtSmcMemberContact}</Text>
                          )}
                        </>
                      )}
                    </View>
                  )}

                  {step === 4 && ( // Private Schools Details
                    <View>
                      <Text style={styles.label}>Are there Private Schools? <Text style={{ color: 'red' }}>*</Text></Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={[
                          { label: 'Select', value: '' },
                          { label: 'Yes', value: true },
                          { label: 'No', value: false }
                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder="Select"
                        value={values.hasPrivateSchools}
                        onChange={(item) => {
                          setFieldValue('hasPrivateSchools', item.value);
                          // Reset other fields if 'No' is selected
                          if (item.value !== 'yes') {
                            // Reset all private school related fields
                            setFieldValue('privateSchoolName', '');
                            setFieldValue('privateSchoolCategory', '');
                            setFieldValue('privateSchoolMedium', '');
                            // Add other fields to reset as needed
                          }
                        }}
                      />
                      {touched.hasPrivateSchools && errors.hasPrivateSchools && (
                        <Text style={styles.error}>{errors.hasPrivateSchools}</Text>
                      )}

                      {values.hasPrivateSchools === true && (
                        <>
                          <Text style={styles.label}>Name of School <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Private School Name"
                            placeholderTextColor="gray"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolName')}
                            onBlur={handleBlur('privateSchoolName')}
                            value={values.privateSchoolName}
                          />
                          {touched.privateSchoolName && errors.privateSchoolName && (
                            <Text style={styles.error}>{errors.privateSchoolName}</Text>
                          )}

                          <Text style={styles.label}>Category of School <Text style={{ color: 'red' }}>*</Text></Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                              { label: 'Select Category', value: '' },
                              { label: 'Primary', value: 'primary' },
                              { label: 'Secondary', value: 'secondary' },
                              { label: 'Higher Secondary', value: 'higherSecondary' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Category"
                            value={values.privateSchoolCategory}
                            onChange={(item) => setFieldValue('privateSchoolCategory', item.value)}
                          />
                          {touched.privateSchoolCategory && errors.privateSchoolCategory && (
                            <Text style={styles.error}>{errors.privateSchoolCategory}</Text>
                          )}

                          <Text style={styles.label}>Medium of Education <Text style={{ color: 'red' }}>*</Text></Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                              { label: 'Select Medium', value: '' },
                              { label: 'Marathi', value: 'Marathi' },
                              { label: 'Hindi', value: 'Hindi' },
                              { label: 'English', value: 'English' },
                              { label: 'Semi-English', value: 'Semi-English' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Medium"
                            value={values.privateSchoolMedium}
                            onChange={(item) => setFieldValue('privateSchoolMedium', item.value)}
                          />
                          {touched.privateSchoolMedium && errors.privateSchoolMedium && (
                            <Text style={styles.error}>{errors.privateSchoolMedium}</Text>
                          )}

                          <Text style={styles.label}>Number of Students (Girls) <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Girl Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolGirlStudents')}
                            onBlur={handleBlur('privateSchoolGirlStudents')}
                            value={values.privateSchoolGirlStudents}
                          />
                          {touched.privateSchoolGirlStudents && errors.privateSchoolGirlStudents && (
                            <Text style={styles.error}>{errors.privateSchoolGirlStudents}</Text>
                          )}

                          <Text style={styles.label}>Number of Students (Boys) <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Boy Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolBoyStudents')}
                            onBlur={handleBlur('privateSchoolBoyStudents')}
                            value={values.privateSchoolBoyStudents}
                          />
                          {touched.privateSchoolBoyStudents && errors.privateSchoolBoyStudents && (
                            <Text style={styles.error}>{errors.privateSchoolBoyStudents}</Text>
                          )}

                          <Text style={styles.label}>Students in 4th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 4th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolStudentsIn4thClass')}
                            onBlur={handleBlur('privateSchoolStudentsIn4thClass')}
                            value={values.privateSchoolStudentsIn4thClass}
                          />

                          <Text style={styles.label}>Students in 5th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 5th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolStudentsIn5thClass')}
                            onBlur={handleBlur('privateSchoolStudentsIn5thClass')}
                            value={values.privateSchoolStudentsIn5thClass}
                          />

                          <Text style={styles.label}>Students in 8th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 8th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolStudentsIn8thClass')}
                            onBlur={handleBlur('privateSchoolStudentsIn8thClass')}
                            value={values.privateSchoolStudentsIn8thClass}
                          />

                          <Text style={styles.label}>Students in 10th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 10th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolStudentsIn10thClass')}
                            onBlur={handleBlur('privateSchoolStudentsIn10thClass')}
                            value={values.privateSchoolStudentsIn10thClass}
                          />

                          <Text style={styles.label}>Name of Principal <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Principal's Name"
                            placeholderTextColor="gray"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolPrincipalName')}
                            onBlur={handleBlur('privateSchoolPrincipalName')}
                            value={values.privateSchoolPrincipalName}
                          />
                          {touched.privateSchoolPrincipalName && errors.privateSchoolPrincipalName && (
                            <Text style={styles.error}>{errors.privateSchoolPrincipalName}</Text>
                          )}

                          <Text style={styles.label}>Principal's Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Principal's Contact Number"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolPrincipalContactNumber')}
                            onBlur={handleBlur('privateSchoolPrincipalContactNumber')}
                            value={values.privateSchoolPrincipalContactNumber}
                          />
                          {touched.privateSchoolPrincipalContactNumber && errors.privateSchoolPrincipalContactNumber && (
                            <Text style={styles.error}>{errors.privateSchoolPrincipalContactNumber}</Text>
                          )}

                          <Text style={styles.label}>SMC Member Name <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter SMC Member's Name"
                            placeholderTextColor="gray"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolSmcMemberName')}
                            onBlur={handleBlur('privateSchoolSmcMemberName')}
                            value={values.privateSchoolSmcMemberName}
                          />
                          {touched.privateSchoolSmcMemberName && errors.privateSchoolSmcMemberName && (
                            <Text style={styles.error}>{errors.privateSchoolSmcMemberName}</Text>
                          )}

                          <Text style={styles.label}>SMC Member Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter SMC Member's Contact Number"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('privateSchoolSmcMemberContactNumber')}
                            onBlur={handleBlur('privateSchoolSmcMemberContactNumber')}
                            value={values.privateSchoolSmcMemberContactNumber}
                          />
                          {touched.privateSchoolSmcMemberContactNumber && errors.privateSchoolSmcMemberContactNumber && (
                            <Text style={styles.error}>{errors.privateSchoolSmcMemberContactNumber}</Text>
                          )}
                        </>
                      )}
                    </View>
                  )}

                  {step === 5 && ( // Ashramshala Details
                    <View>
                      <Text style={styles.label}>Are there Ashramshala Schools? <Text style={{ color: 'red' }}>*</Text></Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={[
                          { label: 'Select', value: '' },
                          { label: 'Yes', value: true },
                          { label: 'No', value: false }
                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder="Select"
                        value={values.hasAshramshala}
                        onChange={(item) => {
                          setFieldValue('hasAshramshala', item.value);
                          // Reset other fields if 'No' is selected
                          if (item.value !== 'yes') {
                            // Reset all Ashramshala school related fields
                            setFieldValue('ashramshalaSchoolName', '');
                            setFieldValue('ashramshalaSchoolCategory', '');
                            setFieldValue('ashramshalaSchoolMedium', '');
                            // Add other fields to reset as needed
                          }
                        }}
                      />
                      {touched.hasAshramshala && errors.hasAshramshala && (
                        <Text style={styles.error}>{errors.hasAshramshala}</Text>
                      )}

                      {values.hasAshramshala === true && (
                        <>
                          {/* Rest of the existing code remains the same, with Picker components replaced by Dropdown */}
                          <Text style={styles.label}>Category of School <Text style={{ color: 'red' }}>*</Text></Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                              { label: 'Select Category', value: '' },
                              { label: 'Primary', value: 'primary' },
                              { label: 'Secondary', value: 'secondary' },
                              { label: 'Higher Secondary', value: 'higherSecondary' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Category"
                            value={values.ashramshalaSchoolCategory}
                            onChange={(item) => setFieldValue('ashramshalaSchoolCategory', item.value)}
                          />
                          {touched.ashramshalaSchoolCategory && errors.ashramshalaSchoolCategory && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolCategory}</Text>
                          )}

                          <Text style={styles.label}>Medium of Education <Text style={{ color: 'red' }}>*</Text></Text>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={[
                              { label: 'Select Medium', value: '' },
                              { label: 'Marathi', value: 'Marathi' },
                              { label: 'Hindi', value: 'Hindi' },
                              { label: 'English', value: 'English' },
                              { label: 'Semi-English', value: 'Semi-English' }
                            ]}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Medium"
                            value={values.ashramshalaSchoolMedium}
                            onChange={(item) => setFieldValue('ashramshalaSchoolMedium', item.value)}
                          />
                          {touched.ashramshalaSchoolMedium && errors.ashramshalaSchoolMedium && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolMedium}</Text>
                          )}

                          <Text style={styles.label}>Number of Students (Girls) <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Girl Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolGirlStudents')}
                            onBlur={handleBlur('ashramshalaSchoolGirlStudents')}
                            value={values.ashramshalaSchoolGirlStudents}
                          />
                          {touched.ashramshalaSchoolGirlStudents && errors.ashramshalaSchoolGirlStudents && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolGirlStudents}</Text>
                          )}

                          <Text style={styles.label}>Number of Students (Boys) <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Boy Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolBoyStudents')}
                            onBlur={handleBlur('ashramshalaSchoolBoyStudents')}
                            value={values.ashramshalaSchoolBoyStudents}
                          />
                          {touched.ashramshalaSchoolBoyStudents && errors.ashramshalaSchoolBoyStudents && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolBoyStudents}</Text>
                          )}

                          <Text style={styles.label}>Students in 4th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 4th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolStudentsIn4thClass')}
                            onBlur={handleBlur('ashramshalaSchoolStudentsIn4thClass')}
                            value={values.ashramshalaSchoolStudentsIn4thClass}
                          />

                          <Text style={styles.label}>Students in 5th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 5th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolStudentsIn5thClass')}
                            onBlur={handleBlur('ashramshalaSchoolStudentsIn5thClass')}
                            value={values.ashramshalaSchoolStudentsIn5thClass}
                          />

                          <Text style={styles.label}>Students in 8th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 8th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolStudentsIn8thClass')}
                            onBlur={handleBlur('ashramshalaSchoolStudentsIn8thClass')}
                            value={values.ashramshalaSchoolStudentsIn8thClass}
                          />

                          <Text style={styles.label}>Students in 10th Class</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of 10th Class Students"
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolStudentsIn10thClass')}
                            onBlur={handleBlur('ashramshalaSchoolStudentsIn10thClass')}
                            value={values.ashramshalaSchoolStudentsIn10thClass}
                          />

                          <Text style={styles.label}>Name of Principal <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Principal's Name"
                            placeholderTextColor="gray"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolPrincipalName')}
                            onBlur={handleBlur('ashramshalaSchoolPrincipalName')}
                            value={values.ashramshalaSchoolPrincipalName}
                          />
                          {touched.ashramshalaSchoolPrincipalName && errors.ashramshalaSchoolPrincipalName && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolPrincipalName}</Text>
                          )}

                          <Text style={styles.label}>Principal's Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Principal's Contact Number"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolPrincipalContactNumber')}
                            onBlur={handleBlur('ashramshalaSchoolPrincipalContactNumber')}
                            value={values.ashramshalaSchoolPrincipalContactNumber}
                          />
                          {touched.ashramshalaSchoolPrincipalContactNumber && errors.ashramshalaSchoolPrincipalContactNumber && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolPrincipalContactNumber}</Text>
                          )}

                          <Text style={styles.label}>SMC Member Name <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter SMC Member's Name"
                            placeholderTextColor="gray"
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolSmcMemberName')}
                            onBlur={handleBlur('ashramshalaSchoolSmcMemberName')}
                            value={values.ashramshalaSchoolSmcMemberName}
                          />
                          {touched.ashramshalaSchoolSmcMemberName && errors.ashramshalaSchoolSmcMemberName && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolSmcMemberName}</Text>
                          )}

                          <Text style={styles.label}>SMC Member Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter SMC Member's Contact Number"
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            maxLength={10}
                            onChangeText={handleChangeWithTouch(
                              setFieldValue,
                              setFieldTouched,
                            )('ashramshalaSchoolSmcMemberContactNumber')}
                            onBlur={handleBlur('ashramshalaSchoolSmcMemberContactNumber')}
                            value={values.ashramshalaSchoolSmcMemberContactNumber}
                          />
                          {touched.ashramshalaSchoolSmcMemberContactNumber && errors.ashramshalaSchoolSmcMemberContactNumber && (
                            <Text style={styles.error}>{errors.ashramshalaSchoolSmcMemberContactNumber}</Text>
                          )}
                        </>
                      )}
                    </View>
                  )}
                  {step === 6 && ( // Preview

                    <View>
                      {/* Location Details */}
                      <TouchableOpacity onPress={() => toggleStep(1)} style={styles.dropdownHeader}>
                        <Text style={styles.dropdownTitle}>Location Details</Text>
                        <Text>{activeStep === 1 ? '▲' : '▼'}</Text>
                      </TouchableOpacity>
                      {activeStep === 1 && (
                        <View>
                          <Text style={styles.label}>Village <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Village name"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.village}
                          />
                          {touched.village && errors.village && <Text style={styles.error}>{errors.village}</Text>}

                          <Text style={styles.label}>gramPanchayat <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter gramPanchayat Name"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.gramPanchayat}
                          />
                          {touched.gramPanchayat && errors.gramPanchayat && <Text style={styles.error}>{errors.gramPanchayat}</Text>}

                          <Text style={styles.label}>Taluka<Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Taluka Name"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.taluka}
                          />
                          {touched.taluka && errors.taluka && <Text style={styles.error}>{errors.taluka}</Text>}

                          <Text style={styles.label}>District<Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter District Name"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.district}
                          />
                          {touched.district && errors.district && <Text style={styles.error}>{errors.district}</Text>}

                          <Text style={styles.label}>Pin Code<Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ente Pin code"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.pinCode}
                          />
                          {touched.pinCode && errors.pinCode && <Text style={styles.error}>{errors.pinCode}</Text>}
                        </View>
                      )}

                      {/* Population Details */}
                      <TouchableOpacity onPress={() => toggleStep(2)} style={styles.dropdownHeader}>
                        <Text style={styles.dropdownTitle}>Population Details</Text>
                        <Text>{activeStep === 2 ? '▲' : '▼'}</Text>
                      </TouchableOpacity>
                      {activeStep === 2 && (
                        <View>
                          <Text style={styles.label}>Number of Males <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Males"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.males}
                          />
                          {touched.males && errors.males && <Text style={styles.error}>{errors.males}</Text>}

                          <Text style={styles.label}>Number of Females  <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Females"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.females}
                          />
                          {touched.females && errors.females && <Text style={styles.error}>{errors.females}</Text>}

                          <Text style={styles.label}>Number of Houses <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Houses "
                            placeholderTextColor="gray"
                            readOnly
                            value={values.houses}
                          />
                          {touched.houses && errors.houses && <Text style={styles.error}>{errors.houses}</Text>}

                          <Text style={styles.label}>Number of Families <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Families  "
                            placeholderTextColor="gray"
                            readOnly
                            value={values.families}
                          />
                          {touched.families && errors.families && <Text style={styles.error}>{errors.families}</Text>}

                          <Text style={styles.label}>Number of Student Girls (6th to 8th)<Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Girls from 6th to 8th "
                            placeholderTextColor="gray"
                            readOnly
                            value={values.studentGirls6to8}
                          />
                          {touched.studentGirls6to8 && errors.studentGirls6to8 && <Text style={styles.error}>{errors.studentGirls6to8}</Text>}

                          <Text style={styles.label}>Number of Student Boys (6th to 8th)<Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Number of Student Boys (6th to 8th) "
                            placeholderTextColor="gray"
                            readOnly
                            value={values.studentBoys6to8}
                          />
                          {touched.studentBoys6to8 && errors.studentBoys6to8 && <Text style={styles.error}>{errors.studentBoys6to8}</Text>}

                          <Text style={styles.label}>Total Population <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter Total Population  "
                            placeholderTextColor="gray"
                            readOnly
                            value={values.totalPopulation}
                          />
                          {touched.totalPopulation && errors.totalPopulation && <Text style={styles.error}>{errors.totalPopulation}</Text>}
                        </View>
                      )}
                      {/* Government School details */}
                      <TouchableOpacity onPress={() => toggleStep(3)} style={styles.dropdownHeader}>
                        <Text style={styles.dropdownTitle}>Government Schools Details</Text>
                        <Text>{activeStep === 3 ? '▲' : '▼'}</Text>
                      </TouchableOpacity>
                      {activeStep === 3 && (
                        <View>
                          <Text style={styles.label}>Are there Government Schools? <Text style={{ color: 'red' }}>*</Text></Text>

                          <TextInput
                            style={styles.input}
                            placeholder="Are there Government Schools?"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.hasGovtSchool === true ? 'Yes' : values.hasGovtSchool === false ? 'No' : 'Select'}
                          />
                          {touched.hasGovtSchool && errors.hasGovtSchool && (
                            <Text style={styles.error}>{errors.hasGovtSchool}</Text>
                          )}
                          {values.hasGovtSchool === true && (
                            <>
                              <Text style={styles.label}>Category of School <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Category of School "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtSchoolCategory === 'primary' ? 'Primary' : values.govtSchoolCategory === 'secondary' ? 'Secondary' : values.govtSchoolCategory === 'higherSecondary' ? 'Higher Secondary' : 'Select'}

                              />
                              {touched.govtSchoolCategory && errors.govtSchoolCategory && (
                                <Text style={styles.error}>{errors.govtSchoolCategory}</Text>
                              )}

                              <Text style={styles.label}>Medium of Education  <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Medium of Education "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtSchoolMedium === 'Marathi' ? 'Marathi' : values.govtSchoolMedium === 'Hindi' ? 'Hindi' : values.govtSchoolMedium === 'English' ? 'English' : values.govtSchoolMedium === 'Semi-English' ? 'Semi-English' : 'Select'}

                              />
                              {touched.govtSchoolMedium && errors.govtSchoolMedium && <Text style={styles.error}>{errors.govtSchoolMedium}</Text>}

                              <Text style={styles.label}>Name of School <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Name of School   "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtSchoolName}
                              />
                              {touched.govtSchoolName && errors.govtSchoolName && <Text style={styles.error}>{errors.govtSchoolName}</Text>}

                              <Text style={styles.label}>Number of Students (Girls) <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of Students (Girls) "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtStudentsGirls}
                              />
                              {touched.govtStudentsGirls && errors.govtStudentsGirls && <Text style={styles.error}>{errors.govtStudentsGirls}</Text>}

                              <Text style={styles.label}>Number of Students (Boys) <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of Students (Boys)  "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtStudentsBoys}
                              />
                              {touched.govtStudentsBoys && errors.govtStudentsBoys && <Text style={styles.error}>{errors.govtStudentsBoys}</Text>}

                              <Text style={styles.label}>Students in 4th Class  <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Students in 4th Class  "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtStudentsClass4}
                              />
                              {touched.govtStudentsClass4 && errors.govtStudentsClass4 && <Text style={styles.error}>{errors.govtStudentsClass4}</Text>}

                              <Text style={styles.label}>Students in 5th Class <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Students in 5th Class  "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtStudentsClass5}
                              />
                              {touched.govtStudentsClass5 && errors.govtStudentsClass5 && <Text style={styles.error}>{errors.govtStudentsClass5}</Text>}

                              <Text style={styles.label}>Students in 8th Class <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Students in 8th Class "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtStudentsClass8}
                              />
                              {touched.govtStudentsClass8 && errors.govtStudentsClass8 && <Text style={styles.error}>{errors.govtStudentsClass8}</Text>}

                              <Text style={styles.label}>Students in 10th Class<Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Students in 10th Class"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtStudentsClass10}
                              />
                              {touched.govtStudentsClass10 && errors.govtStudentsClass10 && <Text style={styles.error}>{errors.govtStudentsClass10}</Text>}

                              <Text style={styles.label}>Name of Principal <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Name of Principal "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtPrincipalName}
                              />
                              {touched.govtPrincipalName && errors.govtPrincipalName && <Text style={styles.error}>{errors.govtPrincipalName}</Text>}

                              <Text style={styles.label}>Principal's Contact Number  <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Principal's Contact Number  "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtPrincipalContact}
                              />
                              {touched.govtPrincipalContact && errors.govtPrincipalContact && <Text style={styles.error}>{errors.govtPrincipalContact}</Text>}

                              <Text style={styles.label}>SMC Member Name <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter SMC Member Name "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtSmcMemberName}
                              />
                              {touched.govtSmcMemberName && errors.govtSmcMemberName && <Text style={styles.error}>{errors.govtSmcMemberName}</Text>}

                              <Text style={styles.label}>SMC Member Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter SMC Member Contact Number  "
                                placeholderTextColor="gray"
                                readOnly
                                value={values.govtSmcMemberContact}
                              />
                              {touched.govtSmcMemberContact && errors.govtSmcMemberContact && <Text style={styles.error}>{errors.govtSmcMemberContact}</Text>}
                            </>
                          )}

                        </View>

                      )}
                      {/* Private school details */}
                      <TouchableOpacity onPress={() => toggleStep(4)} style={styles.dropdownHeader}>
                        <Text style={styles.dropdownTitle}>Private Schools Details</Text>
                        <Text>{activeStep === 4 ? '▲' : '▼'}</Text>
                      </TouchableOpacity>
                      {activeStep === 4 && (
                        <View>
                          <Text style={styles.label}>Are there Private Schools? <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Are there Private Schools?"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.hasPrivateSchools === 'yes' ? 'Yes' : values.hasPrivateSchools === 'no' ? 'No' : 'Select'}
                          />
                          {touched.hasPrivateSchools && errors.hasPrivateSchools && (
                            <Text style={styles.error}>{errors.hasPrivateSchools}</Text>
                          )}

                          {values.hasPrivateSchools === 'yes' && (
                            <>
                              <Text style={styles.label}>Name of School <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Private School Name"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolName}
                              />
                              {touched.privateSchoolName && errors.privateSchoolName && (
                                <Text style={styles.error}>{errors.privateSchoolName}</Text>
                              )}

                              <Text style={styles.label}>Category of School <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Category of School"
                                placeholderTextColor="gray"
                                readOnly
                                value={
                                  values.privateSchoolCategory === 'primary'
                                    ? 'Primary'
                                    : values.privateSchoolCategory === 'secondary'
                                      ? 'Secondary'
                                      : values.privateSchoolCategory === 'higherSecondary'
                                        ? 'Higher Secondary'
                                        : 'Select'
                                }
                              />
                              {touched.privateSchoolCategory && errors.privateSchoolCategory && (
                                <Text style={styles.error}>{errors.privateSchoolCategory}</Text>
                              )}

                              <Text style={styles.label}>Medium of Education <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Medium of Education"
                                placeholderTextColor="gray"
                                readOnly
                                value={
                                  values.privateSchoolMedium === 'marathi'
                                    ? 'Marathi'
                                    : values.privateSchoolMedium === 'hindi'
                                      ? 'Hindi'
                                      : values.privateSchoolMedium === 'english'
                                        ? 'English'
                                        : values.privateSchoolMedium === 'semiEnglish'
                                          ? 'Semi-English'
                                          : 'Select'
                                }
                              />
                              {touched.privateSchoolMedium && errors.privateSchoolMedium && (
                                <Text style={styles.error}>{errors.privateSchoolMedium}</Text>
                              )}

                              <Text style={styles.label}>Number of Students (Girls) <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of Girl Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolGirlStudents}
                              />
                              {touched.privateSchoolGirlStudents && errors.privateSchoolGirlStudents && (
                                <Text style={styles.error}>{errors.privateSchoolGirlStudents}</Text>
                              )}

                              <Text style={styles.label}>Number of Students (Boys) <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of Boy Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolBoyStudents}
                              />
                              {touched.privateSchoolBoyStudents && errors.privateSchoolBoyStudents && (
                                <Text style={styles.error}>{errors.privateSchoolBoyStudents}</Text>
                              )}

                              <Text style={styles.label}>Students in 4th Class</Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 4th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolStudentsIn4thClass}
                              />

                              <Text style={styles.label}>Students in 5th Class</Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 5th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolStudentsIn5thClass}
                              />

                              <Text style={styles.label}>Students in 8th Class</Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 8th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolStudentsIn8thClass}
                              />

                              <Text style={styles.label}>Students in 10th Class</Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 10th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolStudentsIn10thClass}
                              />

                              <Text style={styles.label}>Name of Principal <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Principal's Name"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolPrincipalName}
                              />
                              {touched.privateSchoolPrincipalName && errors.privateSchoolPrincipalName && (
                                <Text style={styles.error}>{errors.privateSchoolPrincipalName}</Text>
                              )}

                              <Text style={styles.label}>Principal's Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Principal's Contact Number"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolPrincipalContactNumber}
                              />
                              {touched.privateSchoolPrincipalContactNumber && errors.privateSchoolPrincipalContactNumber && (
                                <Text style={styles.error}>{errors.privateSchoolPrincipalContactNumber}</Text>
                              )}

                              <Text style={styles.label}>SMC Member Name <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter SMC Member's Name"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolSmcMemberName}
                              />
                              {touched.privateSchoolSmcMemberName && errors.privateSchoolSmcMemberName && (
                                <Text style={styles.error}>{errors.privateSchoolSmcMemberName}</Text>
                              )}

                              <Text style={styles.label}>SMC Member Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter SMC Member's Contact Number"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.privateSchoolSmcMemberContactNumber}
                              />
                              {touched.privateSchoolSmcMemberContactNumber && errors.privateSchoolSmcMemberContactNumber && (
                                <Text style={styles.error}>{errors.privateSchoolSmcMemberContactNumber}</Text>
                              )}
                            </>
                          )}
                        </View>
                      )}
                      {/* Ashramshala details */}
                      <TouchableOpacity onPress={() => toggleStep(5)} style={styles.dropdownHeader}>
                        <Text style={styles.dropdownTitle}>Ashram Shala Details</Text>
                        <Text>{activeStep === 5 ? '▲' : '▼'}</Text>
                      </TouchableOpacity>
                      {activeStep === 5 && (
                        <View>
                          <Text style={styles.label}>Are there Ashram Shalas? <Text style={{ color: 'red' }}>*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Are there Ashram Shalas?"
                            placeholderTextColor="gray"
                            readOnly
                            value={values.hasAshramshala === 'yes' ? 'Yes' : values.hasAshramshala === 'no' ? 'No' : 'Select'}
                          />
                          {touched.hasAshramShala && errors.hasAshramShala && (
                            <Text style={styles.error}>{errors.hasAshramShala}</Text>
                          )}

                          {values.hasAshramshala === 'yes' && (
                            <>
                              <Text style={styles.label}>Category of School<Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Category of School"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolCategory === 'primary' ? 'Primary' :
                                  values.ashramshalaSchoolCategory === 'secondary' ? 'Secondary' :
                                    values.ashramshalaSchoolCategory === 'higherSecondary' ? 'Higher Secondary' : 'Select'}
                              />
                              {touched.ashramshalaSchoolCategory && errors.ashramshalaSchoolCategory && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolCategory}</Text>
                              )}

                              <Text style={styles.label}>Medium of Education <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Medium of Education"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolMedium === 'marathi' ? 'Marathi' :
                                  values.ashramshalaSchoolMedium === 'hindi' ? 'Hindi' :
                                    values.ashramshalaSchoolMedium === 'english' ? 'English' :
                                      values.ashramshalaSchoolMedium === 'semiEnglish' ? 'Semi-English' : 'Select'}
                              />
                              {touched.ashramshalaSchoolMedium && errors.ashramshalaSchoolMedium && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolMedium}</Text>
                              )}

                              <Text style={styles.label}>Number of Students (Girls) <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of Girl Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolGirlStudents}
                              />
                              {touched.ashramshalaSchoolGirlStudents && errors.ashramshalaSchoolGirlStudents && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolGirlStudents}</Text>
                              )}

                              <Text style={styles.label}>Number of Students (Boys) <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of Boy Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolBoyStudents}
                              />
                              {touched.ashramshalaSchoolBoyStudents && errors.ashramshalaSchoolBoyStudents && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolBoyStudents}</Text>
                              )}

                              <Text style={styles.label}>Students in 4th Class <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 4th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolStudentsIn4thClass}
                              />
                              {touched.ashramshalaSchoolStudentsIn4thClass && errors.ashramshalaSchoolStudentsIn4thClass && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolStudentsIn4thClass}</Text>
                              )}

                              <Text style={styles.label}>Students in 5th Class <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 5th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolStudentsIn5thClass}
                              />
                              {touched.ashramshalaSchoolStudentsIn5thClass && errors.ashramshalaSchoolStudentsIn5thClass && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolStudentsIn5thClass}</Text>
                              )}

                              <Text style={styles.label}>Students in 8th Class <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 8th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolStudentsIn8thClass}
                              />
                              {touched.ashramshalaSchoolStudentsIn8thClass && errors.ashramshalaSchoolStudentsIn8thClass && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolStudentsIn8thClass}</Text>
                              )}

                              <Text style={styles.label}>Students in 10th Class<Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Number of 10th Class Students"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolStudentsIn10thClass}
                              />
                              {touched.ashramshalaSchoolStudentsIn10thClass && errors.ashramshalaSchoolStudentsIn10thClass && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolStudentsIn10thClass}</Text>
                              )}

                              <Text style={styles.label}>Name of Principal <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Principal's Name"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolPrincipalName}
                              />
                              {touched.ashramshalaSchoolPrincipalName && errors.ashramshalaSchoolPrincipalName && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolPrincipalName}</Text>
                              )}

                              <Text style={styles.label}>Principal's Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter Principal's Contact Number"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolPrincipalContactNumber}
                              />
                              {touched.ashramshalaSchoolPrincipalContactNumber && errors.ashramshalaSchoolPrincipalContactNumber && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolPrincipalContactNumber}</Text>
                              )}

                              <Text style={styles.label}>SMC Member Name <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter SMC Member's Name"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolSmcMemberName}
                              />
                              {touched.ashramshalaSchoolSmcMemberName && errors.ashramshalaSchoolSmcMemberName && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolSmcMemberName}</Text>
                              )}
                              <Text style={styles.label}>SMC Member Contact Number <Text style={{ color: 'red' }}>*</Text></Text>
                              <TextInput
                                style={styles.input}
                                placeholder="Enter SMC Member's Contact Number"
                                placeholderTextColor="gray"
                                readOnly
                                value={values.ashramshalaSchoolSmcMemberContactNumber}
                              />
                              {touched.ashramshalaSchoolSmcMemberContactNumber && errors.ashramshalaSchoolSmcMemberContactNumber && (
                                <Text style={styles.error}>{errors.ashramshalaSchoolSmcMemberContactNumber}</Text>
                              )}
                            </>
                          )}
                        </View>
                      )}

                      
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
    paddingBottom: '80%',
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
    marginTop: 20,
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
    // padding: hp('1.5%'),
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
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },

});

export default GramSurveyForm;