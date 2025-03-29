import {View, Text, Alert, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Formik} from 'formik';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  useGetSanchAreaAllocationById,
  useUpdateSanchAreaAllocation,
} from '../../hooks/newAreaAllocation/sanchArea/useSanchArea';
import {useGetNewAnchalAreaAllocation} from '../../hooks/newAreaAllocation/anchalArea/useAnchalArea';
import {useGetNewSankulAreaAllocation} from '../../hooks/newAreaAllocation/sankulArea/useSankulArea';
import {sanchAreaAllocationSchema} from '../../utils/ValidationSchema';
import GradientButton from '../common/button/GradientButton';
import useZoneData from '../../hooks/zoneData/useZoneData';
import FormField from '../common/formData/FormField';
import Input from '../common/Input/Input';

const UpdateSanchAreaAllocation = ({navigation, route}) => {
  const {sanchNameId} = route.params;
  const formikRef = useRef();

  const {updateSanchArea, loading} = useUpdateSanchAreaAllocation();
  const {zones, loading: zoneLoading, error: zoneError} = useZoneData();
  const {getSanchAreaById} = useGetSanchAreaAllocationById();
  const {
    data: anchalData,
    error: anchalError,
    loading: anchalLoading,
  } = useGetNewAnchalAreaAllocation();
  const {
    data: sankulData,
    error: sankulError,
    loading: sankulLoading,
  } = useGetNewSankulAreaAllocation();
  const [dropdownStates, setDropdownStates] = useState({
    anchal: false,
    sankul: false,
    zone: false,
    states: false,
    districts: false,
    subDistricts: false,
    villages: false,
  });

  const initialValues = {
    sankulName: '',
    selectedAnchal: null,
    selectedSankul: null,
    selectedZone: null,
    selectedStates: [],
    selectedDistricts: [],
    selectedSubDistricts: [],
    selectedVillages: [],
  };

  const handleDropdownOpen = dropdownName => {
    setDropdownStates(prev =>
      Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: key === dropdownName ? true : false,
        }),
        {},
      ),
    );
  };

  const getFilteredOptions = (values, level) => {
    const options = {
      anchal: () =>
        anchalData?.map(anchal => ({
          label: anchal.anchalName,
          value: anchal.anchalName,
          anchalAreaId: anchal.anchalAreaId,
          zoneName: anchal.zoneName,
          states: anchal.states,
        })) || [],
      sankul: () =>
        sankulData?.map(sankul => ({
          label: sankul.sankulName,
          value: sankul.sankulName,
          sankulAreaId: sankul.sankulNameId,
          zoneName: sankul.zoneName,
          states: sankul.states,
        })) || [],

      zone: () =>
        zones?.map(zone => ({
          label: zone.zoneName,
          value: zone.zoneName,
          states: zone.states,
        })) || [],

      state: () =>
        values.selectedZone?.states?.map(state => ({
          label: state.StateName,
          value: state.StateName,
          districts: state.districts,
        })) || [],

      district: () =>
        values.selectedStates.flatMap(state => {
          const zoneState = values.selectedZone?.states?.find(
            s => s.StateName === state.value,
          );
          return (zoneState?.districts || []).map(district => ({
            label: district.Districtname,
            value: district.Districtname,
            stateValue: state.value,
          }));
        }),

      subDistrict: () =>
        values.selectedDistricts.flatMap(district => {
          const zoneState = values.selectedZone?.states?.find(
            s => s.StateName === district.stateValue,
          );
          const zoneDistrict = zoneState?.districts?.find(
            d => d.Districtname === district.value,
          );
          return (zoneDistrict?.subdistricts || []).map(subdistrict => ({
            label: subdistrict['Sub-distname'],
            value: subdistrict['Sub-distname'],
            districtValue: district.value,
            stateValue: district.stateValue,
          }));
        }),

      village: () =>
        values.selectedSubDistricts.flatMap(subdistrict => {
          const zoneState = values.selectedZone?.states?.find(
            s => s.StateName === subdistrict.stateValue,
          );
          const zoneDistrict = zoneState?.districts?.find(
            d => d.Districtname === subdistrict.districtValue,
          );
          const zoneSubDistrict = zoneDistrict?.subdistricts?.find(
            sd => sd['Sub-distname'] === subdistrict.value,
          );
          return (zoneSubDistrict?.details || []).map(village => ({
            label: village.VillageName,
            value: village.VillageName,
            subDistrictValue: subdistrict.value,
            districtValue: subdistrict.districtValue,
            stateValue: subdistrict.stateValue,
          }));
        }),
    };

    return options[level]?.() || [];
  };

  const handleSelectionChange = (
    setFieldValue,
    values,
    level,
    selectedValues,
  ) => {
    const updates = {
      anchal: () => ({
        selectedAnchal: getFilteredOptions(values, 'anchal').find(
          z => z.value === selectedValues,
        ),
        selectedZone: null,
        selectedStates: [],
        selectedDistricts: [],
        selectedSubDistricts: [],
        selectedVillages: [],
      }),
      sankul: () => ({
        selectedSankul: getFilteredOptions(values, 'sankul').find(
          z => z.value === selectedValues,
        ),
        selectedZone: null,
        selectedStates: [],
        selectedDistricts: [],
        selectedSubDistricts: [],
        selectedVillages: [],
      }),
      zone: () => ({
        selectedZone: getFilteredOptions(values, 'zone').find(
          z => z.value === selectedValues,
        ),
        selectedStates: [],
        selectedDistricts: [],
        selectedSubDistricts: [],
        selectedVillages: [],
      }),
      states: () => ({
        selectedStates: getFilteredOptions(values, 'state').filter(state =>
          selectedValues.includes(state.value),
        ),
        selectedDistricts: [],
        selectedSubDistricts: [],
        selectedVillages: [],
      }),
      districts: () => ({
        selectedDistricts: getFilteredOptions(values, 'district').filter(
          district => selectedValues.includes(district.value),
        ),
        selectedSubDistricts: [],
        selectedVillages: [],
      }),
      subDistricts: () => ({
        selectedSubDistricts: getFilteredOptions(values, 'subDistrict').filter(
          subDistrict => selectedValues.includes(subDistrict.value),
        ),
        selectedVillages: [],
      }),
      villages: () => ({
        selectedVillages: getFilteredOptions(values, 'village').filter(
          village => selectedValues.includes(village.value),
        ),
      }),
    };

    const updateFields = updates[level]();
    Object.entries(updateFields).forEach(([field, value]) => {
      setFieldValue(field, value);
    });
  };

  useEffect(() => {
    const fetchSankulArea = async () => {
      if (!sanchNameId || !zones?.length || !anchalData?.length) return;

      try {
        const data = await getSanchAreaById(sanchNameId);
        if (!data) return;

        const formattedData = {
          sanchName: data.sanchName,
          selectedAnchal: {
            label: data.anchalName,
            value: data.anchalName,
            anchalAreaId: data.anchalNameId,
          },
          selectedSankul: {
            label: data.sankulName,
            value: data.sankulName,
            sankulAreaId: data.sankulNameId,
            zoneName: data.zoneName,
            states: data.states,
          },
          selectedZone: {
            label: data.zoneName,
            value: data.zoneName,
            states: zones.find(z => z.zoneName === data.zoneName)?.states || [],
          },
          selectedStates: data.states.map(state => ({
            label: state.stateName,
            value: state.stateName,
          })),
          selectedDistricts: data.states.flatMap(state =>
            state.districts.map(district => ({
              label: district.districtName,
              value: district.districtName,
              stateValue: state.stateName,
            })),
          ),
          selectedSubDistricts: data.states.flatMap(state =>
            state.districts.flatMap(district =>
              district.subdistricts.map(subdistrict => ({
                label: subdistrict.subDistrictName,
                value: subdistrict.subDistrictName,
                districtValue: district.districtName,
                stateValue: state.stateName,
              })),
            ),
          ),
          selectedVillages: data.states.flatMap(state =>
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
          ),
        };

        formikRef.current?.setValues(formattedData);
      } catch (error) {
        console.error('Error fetching Sankul area:', error);
        Alert.alert('Error', 'Failed to fetch Sankul area details');
      }
    };

    fetchSankulArea();
  }, [sanchNameId, zones, anchalData]);

  const handleUpdateArea = async (values, {setSubmitting}) => {
    try {
      if (!values.selectedAnchal || !values.selectedZone) {
        Alert.alert('Error', 'Please select both Anchal and Zone');
        return;
      }

      const formattedData = {
        zoneName: values.selectedZone.value,
        anchalName: values.selectedAnchal.anchalAreaId,

        sankulName: values.selectedSankul.sankulAreaId,
        sanchName: values.sanchName,
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

      const response = await updateSanchArea(sanchNameId, formattedData);

      if (response.result) {
        Alert.alert('Success', 'Sanch Area Allocation Updated Successfully!');
        navigation.navigate('GetSanchAreaAllocation');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to Update Sanch Area Allocation',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderDropdown = ({
    name,
    label,
    items,
    value,
    setValue,
    disabled = false,
    zIndex,
  }) => (
    <View style={[styles.dropdownContainer, {zIndex}]}>
      <Text style={styles.label}>{label}</Text>
      <DropDownPicker
        open={dropdownStates[name]}
        setOpen={isOpen => handleDropdownOpen(isOpen ? name : '')}
        items={items}
        value={value}
        setValue={setValue}
        multiple={name !== 'zone' && name !== 'anchal' && name != 'sankul'}
        disabled={disabled}
        style={[styles.dropdown, disabled && styles.disabledDropdown]}
        dropDownContainerStyle={styles.dropDownContainer}
        listMode="SCROLLVIEW"
        scrollViewProps={{nestedScrollEnabled: true}}
        mode="BADGE"
        showBadgeDot={false}
        badgeColors={['#E5E7EB']}
        badgeTextStyle={{color: '#374151'}}
        searchable={true}
        searchPlaceholder="Search..."
        closeAfterSelecting={false}
        min={0}
        maxHeight={200}
      />
    </View>
  );

  if (zoneLoading || anchalLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (zoneError || anchalError) {
    return <Text style={styles.errorText}>Error loading data</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Update Sankul Area Allocation</Text>

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={sanchAreaAllocationSchema}
        onSubmit={handleUpdateArea}
        enableReinitialize>
        {({values, setFieldValue, isValid, handleSubmit, errors, touched}) => (
          <View style={styles.formContainer}>
            <FormField name="sanchName" label="Sanch Name">
              <Input
                placeholder="Enter Sanch Name"
                value={values.sanch}
                onChangeText={text => setFieldValue('sanchName', text)}
                error={touched.sanchName && errors.sanchName}
              />
            </FormField>

            {[
              {
                name: 'anchal',
                label: 'Anchal',
                items: getFilteredOptions(values, 'anchal'),
                value: values.selectedAnchal?.value,
                zIndex: 6000,
              },
              {
                name: 'sankul',
                label: 'Sankul',
                items: getFilteredOptions(values, 'sankul'),
                value: values.selectedSankul?.value,
                zIndex: 6000,
              },
              {
                name: 'zone',
                label: 'Zone',
                items: getFilteredOptions(values, 'zone'),
                value: values.selectedZone?.value,
                zIndex: 5000,
              },
              {
                name: 'states',
                label: 'States',
                items: getFilteredOptions(values, 'state'),
                value: values.selectedStates.map(state => state.value),
                disabled: !values.selectedZone,
                zIndex: 4000,
              },
              {
                name: 'districts',
                label: 'Districts',
                items: getFilteredOptions(values, 'district'),
                value: values.selectedDistricts.map(district => district.value),
                disabled: !values.selectedStates.length,
                zIndex: 3000,
              },
              {
                name: 'subDistricts',
                label: 'Sub-Districts',
                value: values.selectedSubDistricts.map(
                  subDistrict => subDistrict.value,
                ),
                items: getFilteredOptions(values, 'subDistrict'),
                disabled: values.selectedDistricts.length === 0,
                zIndex: 2000,
              },
              {
                name: 'villages',
                label: 'Villages',
                value: values.selectedVillages.map(village => village.value),
                items: getFilteredOptions(values, 'village'),
                disabled: values.selectedSubDistricts.length === 0,
                zIndex: 1000,
              },
            ].map(dropdown => (
              <View key={dropdown.name}>
                {renderDropdown({
                  ...dropdown,
                  setValue: callback => {
                    const newValue = callback(dropdown.value);
                    handleSelectionChange(
                      setFieldValue,
                      values,
                      dropdown.name,
                      newValue,
                    );
                  },
                })}
              </View>
            ))}

            <GradientButton
              disabled={loading || !isValid}
              title={loading ? 'Updating...' : 'Update'}
              onPress={handleSubmit}
              style={styles.buttonContainer}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingBottom: 100, // Extra padding for scrolling
  },

  // Header styles
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },

  // Dropdown styles
  dropdownContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  dropdown: {
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  dropDownContainer: {
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    maxHeight: 200,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },

  // Label styles
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
    fontWeight: '500',
  },

  // Input styles
  input: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },

  // Status text styles
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

  // Dropdown item styles
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },

  // Badge styles
  badge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#374151',
  },

  // Disabled styles
  disabledDropdown: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  disabledText: {
    color: '#9CA3AF',
  },

  // Search input styles
  searchContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },

  // Button container
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },

  // Selected item styles
  selectedItem: {
    backgroundColor: '#F3F4F6',
  },
  selectedItemText: {
    color: '#111827',
    fontWeight: '500',
  },

  // Error styles
  errorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },

  // Scroll container
  scrollContainer: {
    flexGrow: 1,
  },

  // Helper text
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default UpdateSanchAreaAllocation;
