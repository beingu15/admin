import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import colors from '../../common/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CustomDropDown = ({ data, setData, placeholder, }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [selected, setSelected] = useState(null);

  const toggleSection = () => {
    setActiveSections(activeSections.length ? [] : [0]);
  };

  const renderHeader = () => (
    <TouchableOpacity
      onPress={toggleSection}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: colors.orange,
        borderRadius: 15,
      }}
    >
      <Text>{selected ? selected.name : placeholder}</Text>
      <AntDesign name={activeSections.length ? 'up' : 'down'} size={20} color="#000" />
    </TouchableOpacity>
  );

  const renderContent = () => (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            setSelected(item);
            setData(item);
            setActiveSections([]);
          }}
          style={{
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.orange,
          }}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View>
      {renderHeader()}
      {activeSections.length ? renderContent() : null}
    </View>
  );
};

export default CustomDropDown;
