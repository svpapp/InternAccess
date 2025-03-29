// import {View, Text, Alert, StyleSheet, ScrollView} from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {Formik} from 'formik';
// import DropDownPicker from 'react-native-dropdown-picker';
// import {
//   useGetSankulAreaAllocationById,
//   useUpdateSankulAreaAllocation,
// } from '../../hooks/newAreaAllocation/sankulArea/useSankulArea';
// import {useGetNewAnchalAreaAllocation} from '../../hooks/newAreaAllocation/anchalArea/useAnchalArea';
// import {sankulAreaAllocationSchema} from '../../utils/ValidationSchema';
// import GradientButton from '../common/button/GradientButton';
// import useZoneData from '../../hooks/zoneData/useZoneData';
// import FormField from '../common/formData/FormField';
// import Input from '../common/Input/Input';

// const UpdateSankulAreaAllocation = ({navigation, route}) => {
//   const {sankulNameId} = route.params;
//   const formikRef = useRef();

//   const {updateSankulArea, loading} = useUpdateSankulAreaAllocation();
//   const {zones, loading: zoneLoading, error: zoneError} = useZoneData();
//   const {getSankulAreaById} = useGetSankulAreaAllocationById();
//   const {
//     data: anchalData,
//     error: anchalError,
//     loading: anchalLoading,
//   } = useGetNewAnchalAreaAllocation();

//   const [dropdownStates, setDropdownStates] = useState({
//     anchal: false,
//     zone: false,
//     states: false,
//     districts: false,
//     subDistricts: false,
//     villages: false,
//   });

//   const initialValues = {
//     sankulName: '',
//     selectedAnchal: null,
//     selectedZone: null,
//     selectedStates: [],
//     selectedDistricts: [],
//     selectedSubDistricts: [],
//     selectedVillages: [],
//   };

//   const handleDropdownOpen = dropdownName => {
//     setDropdownStates(prev =>
//       Object.keys(prev).reduce(
//         (acc, key) => ({
//           ...acc,
//           [key]: key === dropdownName ? true : false,
//         }),
//         {},
//       ),
//     );
//   };

//   const getFilteredOptions = (values, level) => {
//     const options = {
//       anchal: () =>
//         anchalData?.map(anchal => ({
//           label: anchal.anchalName,
//           value: anchal.anchalName,
//           anchalAreaId: anchal.anchalAreaId,
//           zoneName: anchal.zoneName,
//           states: anchal.states,
//         })) || [],

//       zone: () =>
//         zones?.map(zone => ({
//           label: zone.zoneName,
//           value: zone.zoneName,
//           states: zone.states,
//         })) || [],

//       state: () =>
//         values.selectedZone?.states?.map(state => ({
//           label: state.StateName,
//           value: state.StateName,
//           districts: state.districts,
//         })) || [],

//       district: () =>
//         values.selectedStates.flatMap(state => {
//           const zoneState = values.selectedZone?.states?.find(
//             s => s.StateName === state.value,
//           );
//           return (zoneState?.districts || []).map(district => ({
//             label: district.Districtname,
//             value: district.Districtname,
//             stateValue: state.value,
//           }));
//         }),

//       subDistrict: () =>
//         values.selectedDistricts.flatMap(district => {
//           const zoneState = values.selectedZone?.states?.find(
//             s => s.StateName === district.stateValue,
//           );
//           const zoneDistrict = zoneState?.districts?.find(
//             d => d.Districtname === district.value,
//           );
//           return (zoneDistrict?.subdistricts || []).map(subdistrict => ({
//             label: subdistrict['Sub-distname'],
//             value: subdistrict['Sub-distname'],
//             districtValue: district.value,
//             stateValue: district.stateValue,
//           }));
//         }),

//       village: () =>
//         values.selectedSubDistricts.flatMap(subdistrict => {
//           const zoneState = values.selectedZone?.states?.find(
//             s => s.StateName === subdistrict.stateValue,
//           );
//           const zoneDistrict = zoneState?.districts?.find(
//             d => d.Districtname === subdistrict.districtValue,
//           );
//           const zoneSubDistrict = zoneDistrict?.subdistricts?.find(
//             sd => sd['Sub-distname'] === subdistrict.value,
//           );
//           return (zoneSubDistrict?.details || []).map(village => ({
//             label: village.VillageName,
//             value: village.VillageName,
//             subDistrictValue: subdistrict.value,
//             districtValue: subdistrict.districtValue,
//             stateValue: subdistrict.stateValue,
//           }));
//         }),
//     };

//     return options[level]?.() || [];
//   };

//   const handleSelectionChange = (
//     setFieldValue,
//     values,
//     level,
//     selectedValues,
//   ) => {
//     const updates = {
//       anchal: () => ({
//         selectedAnchal: getFilteredOptions(values, 'anchal').find(
//           z => z.value === selectedValues,
//         ),
//         selectedZone: null,
//         selectedStates: [],
//         selectedDistricts: [],
//         selectedSubDistricts: [],
//         selectedVillages: [],
//       }),
//       zone: () => ({
//         selectedZone: getFilteredOptions(values, 'zone').find(
//           z => z.value === selectedValues,
//         ),
//         selectedStates: [],
//         selectedDistricts: [],
//         selectedSubDistricts: [],
//         selectedVillages: [],
//       }),
//       states: () => ({
//         selectedStates: getFilteredOptions(values, 'state').filter(state =>
//           selectedValues.includes(state.value),
//         ),
//         selectedDistricts: [],
//         selectedSubDistricts: [],
//         selectedVillages: [],
//       }),
//       districts: () => ({
//         selectedDistricts: getFilteredOptions(values, 'district').filter(
//           district => selectedValues.includes(district.value),
//         ),
//         selectedSubDistricts: [],
//         selectedVillages: [],
//       }),
//       subDistricts: () => ({
//         selectedSubDistricts: getFilteredOptions(values, 'subDistrict').filter(
//           subDistrict => selectedValues.includes(subDistrict.value),
//         ),
//         selectedVillages: [],
//       }),
//       villages: () => ({
//         selectedVillages: getFilteredOptions(values, 'village').filter(
//           village => selectedValues.includes(village.value),
//         ),
//       }),
//     };

//     const updateFields = updates[level]();
//     Object.entries(updateFields).forEach(([field, value]) => {
//       setFieldValue(field, value);
//     });
//   };

//   useEffect(() => {
//     const fetchSankulArea = async () => {
//       if (!sankulNameId || !zones?.length || !anchalData?.length) return;

//       try {
//         const data = await getSankulAreaById(sankulNameId);
//         if (!data) return;

//         const formattedData = {
//           sankulName: data.sankulName,
//           selectedAnchal: {
//             label: data.anchalName,
//             value: data.anchalName,
//             anchalAreaId: data.anchalNameId,
//           },
//           selectedZone: {
//             label: data.zoneName,
//             value: data.zoneName,
//             states: zones.find(z => z.zoneName === data.zoneName)?.states || [],
//           },
//           selectedStates: data.states.map(state => ({
//             label: state.stateName,
//             value: state.stateName,
//           })),
//           selectedDistricts: data.states.flatMap(state =>
//             state.districts.map(district => ({
//               label: district.districtName,
//               value: district.districtName,
//               stateValue: state.stateName,
//             })),
//           ),
//           selectedSubDistricts: data.states.flatMap(state =>
//             state.districts.flatMap(district =>
//               district.subdistricts.map(subdistrict => ({
//                 label: subdistrict.subDistrictName,
//                 value: subdistrict.subDistrictName,
//                 districtValue: district.districtName,
//                 stateValue: state.stateName,
//               })),
//             ),
//           ),
//           selectedVillages: data.states.flatMap(state =>
//             state.districts.flatMap(district =>
//               district.subdistricts.flatMap(subdistrict =>
//                 subdistrict.villages.map(village => ({
//                   label: village.villageName,
//                   value: village.villageName,
//                   subDistrictValue: subdistrict.subDistrictName,
//                   districtValue: district.districtName,
//                   stateValue: state.stateName,
//                 })),
//               ),
//             ),
//           ),
//         };

//         formikRef.current?.setValues(formattedData);
//       } catch (error) {
//         console.error('Error fetching Sankul area:', error);
//         Alert.alert('Error', 'Failed to fetch Sankul area details');
//       }
//     };

//     fetchSankulArea();
//   }, [sankulNameId, zones, anchalData]);

//   const handleUpdateArea = async (values, {setSubmitting}) => {
//     try {
//       if (!values.selectedAnchal || !values.selectedZone) {
//         Alert.alert('Error', 'Please select both Anchal and Zone');
//         return;
//       }

//       const formattedData = {
//         zoneName: values.selectedZone.value,
//         anchalName: values.selectedAnchal.anchalAreaId,
//         sankulName: values.sankulName,
//         states: values.selectedStates.map(state => ({
//           stateName: state.value,
//           districts: values.selectedDistricts
//             .filter(district => district.stateValue === state.value)
//             .map(district => ({
//               districtName: district.value,
//               subdistricts: values.selectedSubDistricts
//                 .filter(
//                   subDistrict =>
//                     subDistrict.districtValue === district.value &&
//                     subDistrict.stateValue === state.value,
//                 )
//                 .map(subDistrict => ({
//                   subDistrictName: subDistrict.value,
//                   villages: values.selectedVillages
//                     .filter(
//                       village =>
//                         village.subDistrictValue === subDistrict.value &&
//                         village.districtValue === district.value &&
//                         village.stateValue === state.value,
//                     )
//                     .map(village => ({
//                       villageName: village.value,
//                     })),
//                 })),
//             })),
//         })),
//       };

//       const response = await updateSankulArea(sankulNameId, formattedData);

//       if (response.result) {
//         Alert.alert('Success', 'Sankul Area Allocation Updated Successfully!');
//         navigation.navigate('GetSankulAreaAllocation');
//       }
//     } catch (error) {
//       Alert.alert(
//         'Error',
//         error.message || 'Failed to Update Sankul Area Allocation',
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderDropdown = ({
//     name,
//     label,
//     items,
//     value,
//     setValue,
//     disabled = false,
//     zIndex,
//   }) => (
//     <View style={[styles.dropdownContainer, {zIndex}]}>
//       <Text style={styles.label}>{label}</Text>
//       <DropDownPicker
//         open={dropdownStates[name]}
//         setOpen={isOpen => handleDropdownOpen(isOpen ? name : '')}
//         items={items}
//         value={value}
//         setValue={setValue}
//         multiple={name !== 'zone' && name !== 'anchal'}
//         disabled={disabled}
//         style={[styles.dropdown, disabled && styles.disabledDropdown]}
//         dropDownContainerStyle={styles.dropDownContainer}
//         listMode="SCROLLVIEW"
//         scrollViewProps={{nestedScrollEnabled: true}}
//         mode="BADGE"
//         showBadgeDot={false}
//         badgeColors={['#E5E7EB']}
//         badgeTextStyle={{color: '#374151'}}
//         searchable={true}
//         searchPlaceholder="Search..."
//         closeAfterSelecting={false}
//         min={0}
//         maxHeight={200}
//       />
//     </View>
//   );

//   if (zoneLoading || anchalLoading) {
//     return <Text style={styles.loadingText}>Loading...</Text>;
//   }

//   if (zoneError || anchalError) {
//     return <Text style={styles.errorText}>Error loading data</Text>;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.headerText}>Update Sankul Area Allocation</Text>

//       <Formik
//         innerRef={formikRef}
//         initialValues={initialValues}
//         validationSchema={sankulAreaAllocationSchema}
//         onSubmit={handleUpdateArea}
//         enableReinitialize>
//         {({values, setFieldValue, isValid, handleSubmit, errors, touched}) => (
//           <View style={styles.formContainer}>
//             <FormField name="sankulName" label="Sankul Name">
//               <Input
//                 placeholder="Enter Sankul Name"
//                 value={values.sankulName}
//                 onChangeText={text => setFieldValue('sankulName', text)}
//                 error={touched.sankulName && errors.sankulName}
//               />
//             </FormField>

//             {[
//               {
//                 name: 'anchal',
//                 label: 'Anchal',
//                 items: getFilteredOptions(values, 'anchal'),
//                 value: values.selectedAnchal?.value,
//                 zIndex: 6000,
//               },
//               {
//                 name: 'zone',
//                 label: 'Zone',
//                 items: getFilteredOptions(values, 'zone'),
//                 value: values.selectedZone?.value,
//                 zIndex: 5000,
//               },
//               {
//                 name: 'states',
//                 label: 'States',
//                 items: getFilteredOptions(values, 'state'),
//                 value: values.selectedStates.map(state => state.value),
//                 disabled: !values.selectedZone,
//                 zIndex: 4000,
//               },
//               {
//                 name: 'districts',
//                 label: 'Districts',
//                 items: getFilteredOptions(values, 'district'),
//                 value: values.selectedDistricts.map(district => district.value),
//                 disabled: !values.selectedStates.length,
//                 zIndex: 3000,
//               },
//               {
//                 name: 'subDistricts',
//                 label: 'Sub-Districts',
//                 value: values.selectedSubDistricts.map(
//                   subDistrict => subDistrict.value,
//                 ),
//                 items: getFilteredOptions(values, 'subDistrict'),
//                 disabled: values.selectedDistricts.length === 0,
//                 zIndex: 2000,
//               },
//               {
//                 name: 'villages',
//                 label: 'Villages',
//                 value: values.selectedVillages.map(village => village.value),
//                 items: getFilteredOptions(values, 'village'),
//                 disabled: values.selectedSubDistricts.length === 0,
//                 zIndex: 1000,
//               },
//             ].map(dropdown => (
//               <View key={dropdown.name}>
//                 {renderDropdown({
//                   ...dropdown,
//                   setValue: callback => {
//                     const newValue = callback(dropdown.value);
//                     handleSelectionChange(
//                       setFieldValue,
//                       values,
//                       dropdown.name,
//                       newValue,
//                     );
//                   },
//                 })}
//               </View>
//             ))}

//             <GradientButton
//               disabled={loading || !isValid}
//               title={loading ? 'Updating...' : 'Update'}
//               onPress={handleSubmit}
//               style={styles.buttonContainer}
//             />
//           </View>
//         )}
//       </Formik>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   // Container styles
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   formContainer: {
//     paddingBottom: 100, // Extra padding for scrolling
//   },

//   // Header styles
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 16,
//   },

//   // Dropdown styles
//   dropdownContainer: {
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 1,
//     elevation: 2,
//   },
//   dropdown: {
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     minHeight: 50,
//   },
//   dropDownContainer: {
//     borderColor: '#D1D5DB',
//     backgroundColor: '#fff',
//     maxHeight: 200,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//     elevation: 4,
//   },

//   // Label styles
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#374151',
//     fontWeight: '500',
//   },

//   // Input styles
//   input: {
//     backgroundColor: '#fff',
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//   },

//   // Status text styles
//   loadingText: {
//     fontSize: 16,
//     color: '#374151',
//     textAlign: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#EF4444',
//     textAlign: 'center',
//     padding: 20,
//   },

//   // Dropdown item styles
//   dropdownItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   dropdownItemText: {
//     fontSize: 14,
//     color: '#374151',
//   },

//   // Badge styles
//   badge: {
//     backgroundColor: '#E5E7EB',
//     borderRadius: 16,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     marginRight: 4,
//     marginBottom: 4,
//   },
//   badgeText: {
//     fontSize: 12,
//     color: '#374151',
//   },

//   // Disabled styles
//   disabledDropdown: {
//     backgroundColor: '#F3F4F6',
//     borderColor: '#E5E7EB',
//   },
//   disabledText: {
//     color: '#9CA3AF',
//   },

//   // Search input styles
//   searchContainer: {
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   searchInput: {
//     backgroundColor: '#F9FAFB',
//     borderRadius: 6,
//     padding: 8,
//     fontSize: 14,
//   },

//   // Button container
//   buttonContainer: {
//     marginTop: 24,
//     marginBottom: 40,
//   },

//   // Selected item styles
//   selectedItem: {
//     backgroundColor: '#F3F4F6',
//   },
//   selectedItemText: {
//     color: '#111827',
//     fontWeight: '500',
//   },

//   // Error styles
//   errorBorder: {
//     borderColor: '#EF4444',
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     marginTop: 4,
//   },

//   // Scroll container
//   scrollContainer: {
//     flexGrow: 1,
//   },

//   // Helper text
//   helperText: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
// });

// export default UpdateSankulAreaAllocation;

//!v new
// import {View, Text, Alert, StyleSheet, ScrollView} from 'react-native';
// import React, {useEffect, useState} from 'react';

// import {
//   useGetSankulAreaAllocationById,
//   useUpdateSankulAreaAllocation,
//   useGetNewSankulAreaAllocation,
// } from '../../hooks/newAreaAllocation/sankulArea/useSankulArea';
// import GradientButton from '../common/button/GradientButton';
// import useZoneData from '../../hooks/zoneData/useZoneData';
// import Input from '../common/Input/Input';
// import CustomDropdown from '../common/dropdown/CustomDropdown';

// const UpdateSankulAreaAllocation = ({navigation, route}) => {
//   const {updateSankulArea, loading} = useUpdateSankulAreaAllocation();
//   const {zones, loading: zoneLoading, error: zoneError} = useZoneData();
//   const {data: sankulData} = useGetNewSankulAreaAllocation();
//   const {getSankulAreaById} = useGetSankulAreaAllocationById();
//   const {sankulNameId} = route.params;

//   // Form state
//   const [sankulName, setSankulName] = useState('');
//   const [selectedAnchal, setSelectedAnchal] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const [selectedStates, setSelectedStates] = useState([]);
//   const [selectedDistricts, setSelectedDistricts] = useState([]);
//   const [selectedSubDistricts, setSelectedSubDistricts] = useState([]);
//   const [selectedVillages, setSelectedVillages] = useState([]);

//   // Available options
//   const [stateOptions, setStateOptions] = useState([]);
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [subDistrictOptions, setSubDistrictOptions] = useState([]);
//   const [villageOptions, setVillageOptions] = useState([]);

//   // Check if a village is already allocated to another Sankul
//   const isVillageAllocated = (
//     villageName,
//     subDistrictName,
//     districtName,
//     stateName,
//   ) => {
//     return (
//       sankulData?.some(
//         sankul =>
//           sankul._id !== sankulNameId && // Exclude current Sankul
//           sankul.states.some(
//             state =>
//               state.stateName === stateName &&
//               state.districts.some(
//                 district =>
//                   district.districtName === districtName &&
//                   district.subdistricts.some(
//                     subdistrict =>
//                       subdistrict.subDistrictName === subDistrictName &&
//                       subdistrict.villages.some(
//                         village => village.villageName === villageName,
//                       ),
//                   ),
//               ),
//           ),
//       ) || false
//     );
//   };

//   // Initialize form with existing data
//   useEffect(() => {
//     const fetchSankulArea = async () => {
//       if (!sankulNameId || !zones?.length) return;

//       try {
//         const data = await getSankulAreaById(sankulNameId);
//         if (!data) return;

//         setSankulName(data.sankulName);
//         setSelectedAnchal({
//           label: data.anchalName,
//           value: data.anchalName,
//           anchalAreaId: data.anchalNameId,
//         });

//         // Set zone and populate state options
//         const zoneData = zones.find(z => z.zoneName === data.zoneName);
//         if (zoneData) {
//           setSelectedZone(data.zoneName);
//           const states = zoneData.states.map(state => ({
//             label: state.StateName,
//             value: state.StateName,
//           }));
//           setStateOptions(states);
//         }

//         // Set states from existing data
//         const existingStates = data.states.map(state => state.stateName);
//         setSelectedStates(existingStates);

//         // Populate and set districts
//         const districts = data.states.flatMap(state =>
//           state.districts.map(district => ({
//             label: district.districtName,
//             value: district.districtName,
//             stateValue: state.stateName,
//           })),
//         );
//         setDistrictOptions(districts);
//         setSelectedDistricts(districts.map(d => d.value));

//         // Populate and set subdistricts
//         const subdistricts = data.states.flatMap(state =>
//           state.districts.flatMap(district =>
//             district.subdistricts.map(subdistrict => ({
//               label: subdistrict.subDistrictName,
//               value: subdistrict.subDistrictName,
//               districtValue: district.districtName,
//               stateValue: state.stateName,
//             })),
//           ),
//         );
//         setSubDistrictOptions(subdistricts);
//         setSelectedSubDistricts(subdistricts.map(sd => sd.value));

//         // Populate and set villages
//         const villages = data.states.flatMap(state =>
//           state.districts.flatMap(district =>
//             district.subdistricts.flatMap(subdistrict =>
//               subdistrict.villages.map(village => ({
//                 label: village.villageName,
//                 value: village.villageName,
//                 subDistrictValue: subdistrict.subDistrictName,
//                 districtValue: district.districtName,
//                 stateValue: state.stateName,
//                 isAllocated: isVillageAllocated(
//                   village.villageName,
//                   subdistrict.subDistrictName,
//                   district.districtName,
//                   state.stateName,
//                 ),
//               })),
//             ),
//           ),
//         );
//         setVillageOptions(villages);
//         setSelectedVillages(
//           villages.filter(v => !v.isAllocated).map(v => v.value),
//         );
//       } catch (error) {
//         console.error('Error fetching Sankul area:', error);
//         Alert.alert('Error', 'Failed to fetch Sankul area details');
//       }
//     };

//     fetchSankulArea();
//   }, [sankulNameId, zones, getSankulAreaById]);

//   // Handle zone selection change
//   const handleZoneChange = selectedValue => {
//     setSelectedZone(selectedValue);

//     const zone = zones.find(z => z.zoneName === selectedValue);
//     if (zone) {
//       const states = zone.states.map(state => ({
//         label: state.StateName,
//         value: state.StateName,
//       }));
//       setStateOptions(states);
//     }

//     // Reset dependent fields
//     setSelectedStates([]);
//     setSelectedDistricts([]);
//     setSelectedSubDistricts([]);
//     setSelectedVillages([]);
//     setDistrictOptions([]);
//     setSubDistrictOptions([]);
//     setVillageOptions([]);
//   };

//   // Handle states selection change
//   const handleStatesChange = selectedItems => {
//     setSelectedStates(selectedItems);

//     if (selectedZone) {
//       const zone = zones.find(z => z.zoneName === selectedZone);
//       const districts = selectedItems.flatMap(stateValue => {
//         const state = zone.states.find(s => s.StateName === stateValue);
//         return (
//           state?.districts.map(district => ({
//             label: district.Districtname,
//             value: district.Districtname,
//             stateValue: stateValue,
//           })) || []
//         );
//       });

//       setDistrictOptions(districts);
//       setSelectedDistricts([]);
//       setSelectedSubDistricts([]);
//       setSelectedVillages([]);
//       setSubDistrictOptions([]);
//       setVillageOptions([]);
//     }
//   };

//   // Handle districts selection change
//   const handleDistrictsChange = selectedItems => {
//     setSelectedDistricts(selectedItems);

//     if (selectedZone) {
//       const zone = zones.find(z => z.zoneName === selectedZone);
//       const subdistricts = selectedItems.flatMap(districtValue => {
//         const state = zone.states.find(s =>
//           s.districts.some(d => d.Districtname === districtValue),
//         );
//         const district = state?.districts.find(
//           d => d.Districtname === districtValue,
//         );

//         return (
//           district?.subdistricts.map(sd => ({
//             label: sd['Sub-distname'],
//             value: sd['Sub-distname'],
//             districtValue: districtValue,
//             stateValue: state.StateName,
//             isAllocated: false, // You can implement allocation check logic here
//           })) || []
//         );
//       });

//       setSubDistrictOptions(subdistricts);
//       setSelectedSubDistricts([]);
//       setSelectedVillages([]);
//       setVillageOptions([]);
//     }
//   };

//   // Handle subdistricts selection change
//   const handleSubDistrictsChange = selectedItems => {
//     setSelectedSubDistricts(selectedItems);

//     if (selectedZone) {
//       const zone = zones.find(z => z.zoneName === selectedZone);
//       const villages = selectedItems.flatMap(subDistrictValue => {
//         const state = zone.states.find(s =>
//           s.districts.some(d =>
//             d.subdistricts.some(sd => sd['Sub-distname'] === subDistrictValue),
//           ),
//         );
//         const district = state?.districts.find(d =>
//           d.subdistricts.some(sd => sd['Sub-distname'] === subDistrictValue),
//         );
//         const subdistrict = district?.subdistricts.find(
//           sd => sd['Sub-distname'] === subDistrictValue,
//         );

//         return (
//           subdistrict?.details.map(village => ({
//             label: village.VillageName,
//             value: village.VillageName,
//             subDistrictValue: subDistrictValue,
//             districtValue: district.Districtname,
//             stateValue: state.StateName,
//             isAllocated: isVillageAllocated(
//               village.VillageName,
//               subDistrictValue,
//               district.Districtname,
//               state.StateName,
//             ),
//           })) || []
//         );
//       });

//       setVillageOptions(villages);
//       setSelectedVillages([]);
//     }
//   };

//   // Handle form submission
//   const handleUpdateArea = async () => {
//     if (!selectedZone || !sankulName || !selectedStates.length) {
//       Alert.alert('Validation Error', 'Please fill all required fields');
//       return;
//     }

//     try {
//       const formattedData = {
//         zoneName: selectedZone,
//         sankulName,
//         anchalName: selectedAnchal.anchalAreaId,
//         states: selectedStates.map(stateName => ({
//           stateName,
//           districts: selectedDistricts
//             .filter(districtName => {
//               const district = districtOptions.find(
//                 d => d.value === districtName && d.stateValue === stateName,
//               );
//               return district;
//             })
//             .map(districtName => ({
//               districtName,
//               subdistricts: selectedSubDistricts
//                 .filter(subDistrictName => {
//                   const subdistrict = subDistrictOptions.find(
//                     sd =>
//                       sd.value === subDistrictName &&
//                       sd.districtValue === districtName &&
//                       sd.stateValue === stateName,
//                   );
//                   return subdistrict;
//                 })
//                 .map(subDistrictName => ({
//                   subDistrictName,
//                   villages: selectedVillages
//                     .filter(villageName => {
//                       const village = villageOptions.find(
//                         v =>
//                           v.value === villageName &&
//                           v.subDistrictValue === subDistrictName &&
//                           v.districtValue === districtName &&
//                           v.stateValue === stateName &&
//                           !v.isAllocated,
//                       );
//                       return village;
//                     })
//                     .map(villageName => ({
//                       villageName,
//                     })),
//                 })),
//             })),
//         })),
//       };

//       const response = await updateSankulArea(sankulNameId, formattedData);
//       if (response.result) {
//         Alert.alert('Success', 'Sankul Area Allocation Updated Successfully!');
//         navigation.navigate('GetSankulAreaAllocation');
//       }
//     } catch (error) {
//       Alert.alert(
//         'Error',
//         error.message || 'Failed to Update Sankul Area Allocation',
//       );
//     }
//   };

//   if (zoneLoading)
//     return <Text style={styles.loadingText}>Loading zones...</Text>;
//   if (zoneError)
//     return (
//       <Text style={styles.errorText}>
//         Error loading zones: {zoneError.message}
//       </Text>
//     );

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.headerText}>Update Sankul Area Allocation</Text>

//       <View style={styles.formContainer}>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Sankul Name</Text>
//           <Input
//             autoCapitalize="words"
//             placeholder="Enter Sankul Name"
//             value={sankulName}
//             onChangeText={setSankulName}
//             maxLength={50}
//             style={styles.input}
//           />
//         </View>

//         <CustomDropdown
//           label="Zone"
//           items={
//             zones?.map(zone => ({
//               label: zone.zoneName,
//               value: zone.zoneName,
//             })) || []
//           }
//           selectedItems={selectedZone ? [selectedZone] : []}
//           onSelectedItemsChange={items => handleZoneChange(items[0])}
//           placeholder="Select Zone"
//           single={true}
//         />

//         <CustomDropdown
//           label="States"
//           items={stateOptions}
//           selectedItems={selectedStates}
//           onSelectedItemsChange={handleStatesChange}
//           disabled={!selectedZone}
//           placeholder="Select States"
//         />

//         <CustomDropdown
//           label="Districts"
//           items={districtOptions}
//           selectedItems={selectedDistricts}
//           onSelectedItemsChange={handleDistrictsChange}
//           disabled={!selectedStates.length}
//           placeholder="Select Districts"
//         />

//         <CustomDropdown
//           label="Sub-Districts"
//           items={subDistrictOptions}
//           selectedItems={selectedSubDistricts}
//           onSelectedItemsChange={handleSubDistrictsChange}
//           disabled={!selectedDistricts.length}
//           placeholder="Select Sub-Districts"
//         />

//         <CustomDropdown
//           label="Villages"
//           items={villageOptions.map(v => ({
//             ...v,
//             disabled: v.isAllocated,
//           }))}
//           selectedItems={selectedVillages}
//           onSelectedItemsChange={setSelectedVillages}
//           disabled={!selectedSubDistricts.length}
//           placeholder="Select Villages"
//         />

//         <GradientButton
//           disabled={
//             loading || !selectedZone || !sankulName || !selectedStates.length
//           }
//           title={loading ? 'Updating...' : 'Update'}
//           onPress={handleUpdateArea}
//           style={styles.buttonContainer}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   formContainer: {
//     paddingBottom: 100,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },

//   input: {
//     backgroundColor: '#fff',
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: '#111827',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#374151',
//     textAlign: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#EF4444',
//     textAlign: 'center',
//     padding: 20,
//   },
//   buttonContainer: {
//     marginTop: 24,
//     marginBottom: 40,
//   },
//   selectedItemsContainer: {
//     marginTop: 10,
//     padding: 12,
//     backgroundColor: '#F3F4F6',
//     borderRadius: 8,
//   },
//   selectedItemsHeader: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   selectedItem: {
//     marginBottom: 8,
//   },
//   selectedItemText: {
//     fontSize: 14,
//     color: '#4B5563',
//     fontWeight: '500',
//   },
//   selectedItemSubtext: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginLeft: 16,
//   },
// });

// export default UpdateSankulAreaAllocation;

//!
import {View, Text, Alert, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  useUpdateSankulAreaAllocation,
  useGetNewSankulAreaAllocation,
  useGetSankulAreaAllocationById,
} from '../../hooks/newAreaAllocation/sankulArea/useSankulArea';
import {useGetNewAnchalAreaAllocation} from '../../hooks/newAreaAllocation/anchalArea/useAnchalArea';

import GradientButton from '../common/button/GradientButton';
import useZoneData from '../../hooks/zoneData/useZoneData';
import Input from '../common/Input/Input';
import MultiSelect from 'react-native-multiple-select';
import FormField from '../common/formData/FormField';
import {sankulAreaAllocationSchema} from '../../utils/ValidationSchema';
import {Formik} from 'formik';

const UpdateSankulAreaAllocation = ({navigation, route}) => {
  const {zones, loading: zoneLoading, error: zoneError} = useZoneData();
  const {
    data: anchalData,
    error: anchalError,
    loading: anchalLoading,
  } = useGetNewAnchalAreaAllocation();
  const {
    error: sankulError,
    loading: sankulLoading,
    data: sankulData,
  } = useGetNewSankulAreaAllocation();
  const {
    error: getByIdSankulError,
    getSankulAreaById,
    loading: getByIdSankulLoading,
  } = useGetSankulAreaAllocationById();

  const {error, loading, updateSankulArea, responseData} =
    useUpdateSankulAreaAllocation();
  const {sankulNameId} = route.params;
  const formikRef = useRef();

  const initialValues = {
    anchalName: '',
    selectedAnchal: null,
    selectedZone: null,
    selectedStates: [],
    selectedDistricts: [],
    selectedSubDistricts: [],
    selectedVillages: [],
  };

  const SelectField = ({
    name,
    label,
    options,
    value,
    onChange,
    onBlur,
    isMulti,
    isDisabled,
  }) => (
    <View style={styles.selectFieldContainer}>
      <Text style={styles.labelText}>{label}</Text>
      <MultiSelect
        items={options}
        uniqueKey="value"
        displayKey="label"
        onSelectedItemsChange={onChange}
        selectedItems={
          isMulti ? value.map(item => item.value) : value ? [value.value] : []
        }
        selectText={`Select ${label}`}
        searchInputPlaceholderText={`Search ${label}...`}
        onChangeInput={() => {}}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        searchInputStyle={styles.searchInput}
        styleMainWrapper={styles.multiSelectWrapper}
        styleDropdownMenuSubsection={styles.dropdownSubsection}
        hideSubmitButton
        hideDropdown={isDisabled}
        single={!isMulti}
      />
    </View>
  );

  const handleUpdateArea = async values => {
    try {
      const dataOfAnchalArea = {
        zoneName: values.selectedZone.value,
        anchalName: values.anchalName,
        states: values.selectedStates.map(state => ({
          stateName: state.value,
          districts: values.selectedDistricts
            .filter(district => district.stateValue === state.value)
            .map(district => ({
              districtName: district.value,
              subdistricts: values.selectedSubDistricts
                .filter(
                  subDistrict =>
                    subDistrict.districtValue === district.value &&
                    subDistrict.stateValue === state.value,
                )
                .map(subDistrict => ({
                  subDistrictName: subDistrict.value,
                  villages: values.selectedVillages
                    .filter(
                      village =>
                        village.subDistrictValue === subDistrict.value &&
                        village.districtValue === district.value &&
                        village.stateValue === state.value,
                    )
                    .map(village => ({
                      villageName: village.value,
                    })),
                })),
            })),
        })),
      };

      const response = await updateAnchalArea(anchalAreaId, dataOfAnchalArea);
      if (response.result === true) {
        Alert.alert('Success', 'Anchal Area Allocation Updated Successfully!');
        navigation.navigate('GetAnchalAreaAllocation');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit Anchal Area Allocation',
      );
    }
  };

  useEffect(() => {
    const fetchAnchalArea = async () => {
      if (anchalAreaId && zones?.length > 0) {
        try {
          const data = await getAnchalAreaById(anchalAreaId);

          if (data) {
            const zoneOption = zones.find(
              zone => zone.zoneName === data.zoneName,
            );
            if (!zoneOption) return;
            const formattedZoneOption = {
              label: zoneOption.zoneName,
              value: zoneOption.zoneName,
              states: zoneOption.states,
            };

            const formattedStates = data.states.map(state => {
              const zoneState = zoneOption.states.find(
                s => s.StateName === state.stateName,
              );

              return {
                label: state.stateName,
                value: state.stateName,
                districts: zoneState?.districts || [],
              };
            });

            const formattedDistricts = data.states.flatMap(state =>
              state.districts.map(district => {
                const zoneState = zoneOption.states.find(
                  s => s.StateName === state.stateName,
                );
                const zoneDistrict = zoneState?.districts.find(
                  d => d.Districtname === district.districtName,
                );

                return {
                  label: district.districtName,
                  value: district.districtName,
                  stateValue: state.stateName,
                  subdistricts: zoneDistrict?.subdistricts || [],
                };
              }),
            );

            const formattedSubDistricts = data.states.flatMap(state =>
              state.districts.flatMap(district =>
                district.subdistricts.map(subdistrict => {
                  const zoneState = zoneOption.states.find(
                    s => s.StateName === state.stateName,
                  );
                  const zoneDistrict = zoneState?.districts.find(
                    d => d.Districtname === district.districtName,
                  );
                  const zoneSubDistrict = zoneDistrict?.subdistricts.find(
                    sd => sd['Sub-distname'] === subdistrict.subDistrictName,
                  );

                  return {
                    label: subdistrict.subDistrictName,
                    value: subdistrict.subDistrictName,
                    districtValue: district.districtName,
                    stateValue: state.stateName,
                    details: zoneSubDistrict?.details || [],
                  };
                }),
              ),
            );

            const formattedVillages = data.states.flatMap(state =>
              state.districts.flatMap(district =>
                district.subdistricts.flatMap(subdistrict =>
                  subdistrict.villages.map(village => ({
                    label: village.villageName,
                    value: village.villageName,
                    subDistrictValue: subdistrict.subDistrictName,
                    districtValue: district.districtName,
                    stateValue: state.stateName,
                  })),
                ),
              ),
            );

            if (formikRef.current) {
              formikRef.current.setValues({
                anchalName: data.anchalName,
                selectedZone: formattedZoneOption,
                selectedStates: formattedStates,
                selectedDistricts: formattedDistricts,
                selectedSubDistricts: formattedSubDistricts,
                selectedVillages: formattedVillages,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching anchal area:', error);

          Alert.alert('Failed to fetch anchal area details');
        }
      }
    };

    fetchAnchalArea();
  }, [anchalAreaId, zones]);

  if (zoneLoading)
    return <Text style={styles.loadingText}>Loading zones...</Text>;
  if (zoneError)
    return (
      <Text style={styles.errorText}>
        Error loading zones: {zoneError.message}
      </Text>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Update Anchal Area Allocation</Text>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={sankulAreaAllocationSchema}
        onSubmit={handleUpdateArea}
        enableReinitialize>
        {({values, setFieldValue, setFieldTouched, isValid, handleSubmit}) => {
          const zoneOptions =
            zones?.map(zone => ({
              label: zone.zoneName,
              value: zone.zoneName,
              states: zone.states,
            })) || [];

          const stateOptions =
            values.selectedZone?.states?.map(state => ({
              label: state.StateName,
              value: state.StateName,
              districts: state.districts,
            })) || [];

          const districtOptions = values.selectedStates.flatMap(
            state =>
              state.districts?.map(district => ({
                label: district.Districtname,
                value: district.Districtname,
                stateValue: state.value,
                subdistricts: district.subdistricts,
              })) || [],
          );

          const subDistrictOptions = values.selectedDistricts.flatMap(
            district =>
              district.subdistricts?.map(subdistrict => ({
                label: subdistrict['Sub-distname'],
                value: subdistrict['Sub-distname'],
                districtValue: district.value,
                stateValue: district.stateValue,
                details: subdistrict.details,
              })) || [],
          );

          const villageOptions = values.selectedSubDistricts.flatMap(
            subdistrict =>
              subdistrict.details?.map(village => ({
                label: village.VillageName,
                value: village.VillageName,
                subDistrictValue: subdistrict.value,
                districtValue: subdistrict.districtValue,
                stateValue: subdistrict.stateValue,
              })) || [],
          );

          return (
            <View style={styles.formContainer}>
              <FormField name="anchalName" label="Anchal Name">
                <Input
                  autoCapitalize="words"
                  placeholder="Enter Anchal Name"
                  value={values.anchalName}
                  onChangeText={text => setFieldValue('anchalName', text)}
                  maxLength={50}
                  style={styles.input}
                />
              </FormField>

              <SelectField
                name="selectedZone"
                label="Zone"
                options={zoneOptions}
                value={values.selectedZone}
                onChange={selected => {
                  const selectedZone = zoneOptions.find(
                    zone => zone.value === selected[0],
                  );
                  setFieldValue('selectedZone', selectedZone);
                  setFieldValue('selectedStates', []);
                  setFieldValue('selectedDistricts', []);
                  setFieldValue('selectedSubDistricts', []);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedZone', true)}
                isMulti={false}
              />

              <SelectField
                name="selectedStates"
                label="States"
                options={stateOptions}
                value={values.selectedStates}
                onChange={selected => {
                  const selectedStates = stateOptions.filter(state =>
                    selected.includes(state.value),
                  );
                  setFieldValue('selectedStates', selectedStates);
                  setFieldValue('selectedDistricts', []);
                  setFieldValue('selectedSubDistricts', []);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedStates', true)}
                isMulti={true}
                isDisabled={!values.selectedZone}
              />

              <SelectField
                name="selectedDistricts"
                label="Districts"
                options={districtOptions}
                value={values.selectedDistricts}
                onChange={selected => {
                  const selectedDistricts = districtOptions.filter(district =>
                    selected.includes(district.value),
                  );
                  setFieldValue('selectedDistricts', selectedDistricts);
                  setFieldValue('selectedSubDistricts', []);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedDistricts', true)}
                isMulti={true}
                isDisabled={values.selectedStates.length === 0}
              />

              <SelectField
                name="selectedSubDistricts"
                label="Sub-Districts"
                options={subDistrictOptions}
                value={values.selectedSubDistricts}
                onChange={selected => {
                  const selectedSubDistricts = subDistrictOptions.filter(
                    subDistrict => selected.includes(subDistrict.value),
                  );
                  setFieldValue('selectedSubDistricts', selectedSubDistricts);
                  setFieldValue('selectedVillages', []);
                }}
                onBlur={() => setFieldTouched('selectedSubDistricts', true)}
                isMulti={true}
                isDisabled={values.selectedDistricts.length === 0}
              />

              <SelectField
                name="selectedVillages"
                label="Villages"
                options={villageOptions}
                value={values.selectedVillages}
                onChange={selected => {
                  const selectedVillages = villageOptions.filter(village =>
                    selected.includes(village.value),
                  );
                  setFieldValue('selectedVillages', selectedVillages);
                }}
                onBlur={() => setFieldTouched('selectedVillages', true)}
                isMulti={true}
                isDisabled={values.selectedSubDistricts.length === 0}
              />

              <GradientButton
                disabled={loading || !isValid}
                title={loading ? 'Updating...' : 'Update'}
                onPress={handleSubmit}
                style={styles.buttonContainer}
              />
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  selectFieldContainer: {
    marginVertical: 12,
  },
  multiSelectWrapper: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownSubsection: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  searchInput: {
    color: '#111827',
  },
  loadingText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default UpdateSankulAreaAllocation;
