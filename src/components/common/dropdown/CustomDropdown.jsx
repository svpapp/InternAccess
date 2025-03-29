// import React from 'react';
// import {View, Text, StyleSheet, Alert} from 'react-native';
// import {Picker} from '@react-native-picker/picker';

// const CustomDropdown = ({
//   value,
//   onChange,
//   options = [],
//   placeholder = 'Select an option',
//   error,
//   ...props
// }) => {
//   return (
//     <View style={styles.container}>
//       {value && <Text style={styles.label}>{placeholder}</Text>}
//       <Picker
//         selectedValue={value}
//         onValueChange={itemValue => onChange(itemValue)}
//         style={[
//           styles.picker,
//           error ? styles.errorBorder : styles.normalBorder,
//         ]}
//         {...props}>
//         <Picker.Item label={placeholder} value="" enabled={false} />
//         {options.map(option => (
//           <Picker.Item
//             key={option.value}
//             label={option.label}
//             value={option.value}
//           />
//         ))}
//       </Picker>
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//     position: 'relative',
//   },
//   label: {
//     position: 'absolute',
//     top: -10,
//     left: 10,
//     fontSize: 12,
//     color: '#6B7280', // Tailwind gray-600
//     backgroundColor: 'white',
//     paddingHorizontal: 4,
//     zIndex: 10,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     backgroundColor: 'white',
//   },
//   normalBorder: {
//     borderColor: '#D1D5DB', // Tailwind gray-300
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   errorBorder: {
//     borderColor: '#EF4444', // Tailwind red-500
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   errorText: {
//     color: '#EF4444', // Tailwind red-500
//     fontSize: 12,
//     marginTop: 4,
//   },
// });

// export default CustomDropdown;

//!
// import {View, Text, StyleSheet} from 'react-native';
// import React from 'react';
// import {Dropdown} from 'react-native-element-dropdown';

// const CustomDropdown = ({
//   data,
//   value,
//   onChange,
//   placeholder,
//   disabled,
//   multiple = false,
//   labelField = 'label',
//   valueField = 'value',
// }) => {
//   return (
//     <Dropdown
//       style={[styles.dropdown, disabled && styles.dropdownDisabled]}
//       placeholderStyle={styles.placeholderStyle}
//       selectedTextStyle={styles.selectedTextStyle}
//       data={data || []}
//       maxHeight={300}
//       labelField={labelField}
//       valueField={valueField}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       disable={disabled}
//       multiple={multiple}
//       search
//       searchPlaceholder="Search..."
//     />
//   );
// };
// const styles = StyleSheet.create({
//   dropdown: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   },
//   dropdownDisabled: {
//     backgroundColor: '#F3F4F6',
//   },
//   placeholderStyle: {
//     color: '#9CA3AF',
//   },
//   selectedTextStyle: {
//     color: '#111827',
//   },
// });
// export default CustomDropdown;

//!vv
// import {View, Text, StyleSheet} from 'react-native';
// import React from 'react';
// import MultiSelect from 'react-native-multiple-select';

// const CustomDropdown = ({
//   label,
//   items,
//   selectedItems,
//   onSelectedItemsChange,
//   disabled = false,
//   placeholder,
// }) => {
//   return (
//     <View style={styles.pickerContainer}>
//       <Text style={styles.label}>{label}</Text>
//       <MultiSelect
//         items={items}
//         uniqueKey="value"
//         onSelectedItemsChange={onSelectedItemsChange}
//         selectedItems={selectedItems}
//         selectText={placeholder || `Select ${label}`}
//         searchInputPlaceholderText={`Search ${label}...`}
//         tagRemoveIconColor="#CCC"
//         tagBorderColor="#CCC"
//         tagTextColor="#333"
//         selectedItemTextColor="#333"
//         selectedItemIconColor="#333"
//         itemTextColor="#000"
//         displayKey="label"
//         searchInputStyle={styles.multiSelectSearch}
//         styleMainWrapper={styles.multiSelectWrapper}
//         styleDropdownMenuSubsection={[
//           styles.multiSelectDropdown,
//           disabled && styles.disabledPicker,
//         ]}
//         hideSubmitButton
//         hideDropdown={disabled}
//         single={label === 'Zone'}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   pickerContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#374151',
//     fontWeight: '500',
//   },
//   picker: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#111827',
//   },
//   disabledPicker: {
//     backgroundColor: '#F3F4F6',
//     borderColor: '#E5E7EB',
//     color: '#9CA3AF',
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
//   multiSelectWrapper: {
//     marginTop: 4,
//   },
//   multiSelectDropdown: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#fff',
//   },
//   multiSelectSearch: {
//     backgroundColor: '#fff',
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 8,
//   },
// });
// export default CustomDropdown;

//! v1
// import {View, Text, StyleSheet} from 'react-native';
// import React from 'react';
// import MultiSelect from 'react-native-multiple-select';

// const CustomDropdown = ({
//   label,
//   items = [],
//   selectedItems = [],
//   onSelectedItemsChange,
//   disabled = false,
//   placeholder,
//   error,
//   single = false,
// }) => {
//   return (
//     <View style={styles.container}>
//       {label && <Text style={styles.label}>{label}</Text>}

//       <MultiSelect
//         items={items}
//         uniqueKey="value"
//         onSelectedItemsChange={onSelectedItemsChange}
//         selectedItems={selectedItems}
//         single={single}
//         selectText={placeholder || `Select ${label}`}
//         searchInputPlaceholderText={`Search ${label}...`}
//         hideSubmitButton
//         hideDropdown={disabled}
//         // Styling props
//         styleMainWrapper={styles.multiSelectWrapper}
//         styleDropdownMenuSubsection={[
//           styles.multiSelectDropdown,
//           disabled && styles.disabledDropdown,
//           error && styles.errorDropdown,
//         ]}
//         styleInputGroup={styles.inputGroup}
//         styleItemsContainer={styles.itemsContainer}
//         styleSelectorContainer={styles.selectorContainer}
//         styleTextDropdown={styles.dropdownText}
//         styleTextDropdownSelected={styles.selectedText}
//         // Colors
//         tagRemoveIconColor="#CCC"
//         tagBorderColor="#E5E7EB"
//         tagTextColor="#374151"
//         selectedItemTextColor="#2563EB"
//         selectedItemIconColor="#2563EB"
//         itemTextColor="#374151"
//         searchInputStyle={styles.searchInput}
//       />

//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#374151',
//     fontWeight: '500',
//   },
//   multiSelectWrapper: {
//     marginTop: 4,
//   },
//   multiSelectDropdown: {
//     borderWidth: 1,
//     borderColor: '#D1D5DB',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: '#fff',
//     minHeight: 48,
//   },
//   disabledDropdown: {
//     backgroundColor: '#F3F4F6',
//     borderColor: '#E5E7EB',
//   },
//   errorDropdown: {
//     borderColor: '#EF4444',
//   },
//   inputGroup: {
//     paddingVertical: 8,
//   },
//   itemsContainer: {
//     maxHeight: 300,
//   },
//   selectorContainer: {
//     marginTop: 8,
//   },
//   dropdownText: {
//     fontSize: 16,
//     color: '#374151',
//   },
//   selectedText: {
//     fontSize: 16,
//     color: '#2563EB',
//     fontWeight: '500',
//   },
//   searchInput: {
//     backgroundColor: '#fff',
//     borderColor: '#D1D5DB',
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 8,
//     marginBottom: 8,
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 12,
//     marginTop: 4,
//   },
// });

// export default CustomDropdown;

//!v
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import MultiSelect from 'react-native-multiple-select';

const CustomDropdown = ({
  label,
  items = [],
  selectedItems = [],
  onSelectedItemsChange,
  disabled = false,
  placeholder,
  error,
  single = false,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <MultiSelect
        items={items}
        uniqueKey="value"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        single={single}
        selectText={placeholder || `Select ${label}`}
        searchInputPlaceholderText={`Search ${label}...`}
        hideSubmitButton
        hideDropdown={disabled}
        // Styling props
        styleMainWrapper={styles.multiSelectWrapper}
        styleDropdownMenuSubsection={[
          styles.multiSelectDropdown,
          disabled && styles.disabledDropdown,
          error && styles.errorDropdown,
        ]}
        styleInputGroup={styles.inputGroup}
        styleItemsContainer={styles.itemsContainer}
        styleSelectorContainer={styles.selectorContainer}
        styleTextDropdown={styles.dropdownText}
        styleTextDropdownSelected={styles.selectedText}
        // Colors
        tagRemoveIconColor="#CCC"
        tagBorderColor="#E5E7EB"
        tagTextColor="#374151"
        selectedItemTextColor="#2563EB"
        selectedItemIconColor="#2563EB"
        itemTextColor="#374151"
        searchInputStyle={styles.searchInput}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#374151',
    fontWeight: '500',
  },
  multiSelectWrapper: {
    marginTop: 4,
  },
  multiSelectDropdown: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  disabledDropdown: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  errorDropdown: {
    borderColor: '#EF4444',
  },
  inputGroup: {
    paddingVertical: 8,
  },
  itemsContainer: {
    maxHeight: 300,
  },
  selectorContainer: {
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomDropdown;
