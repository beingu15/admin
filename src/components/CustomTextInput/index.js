import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../common/colors';

const CustomTextInput = ({
  placeholder = '',
  value = '',
  onChangeText,
  icon = null,
  border = false,
  width = '100%',
  placeholderTextColor = colors.orange,
  secureTextEntry = false,
  multiline = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: icon ? 'row' : 'column',
          borderWidth: border ? 1 : 0,
          alignItems: icon ? 'center' : 'baseline',
          borderColor: colors.orange_light,
          width: width,
        },
      ]}
    >
      <TextInput
        style={[styles.input, { flex: icon ? 1 : 0 }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 15,
    borderRadius: 25,
  },
  input: {
    fontSize: 16,
    color: colors.black,
  },
  iconContainer: {
    marginLeft: 10,
  },
});

CustomTextInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  icon: PropTypes.element,
  border: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholderTextColor: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  multiline: PropTypes.bool,
};

export default CustomTextInput;
