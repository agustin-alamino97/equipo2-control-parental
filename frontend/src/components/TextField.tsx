import React, { useRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    type TextInputInstance,
} from 'react-native';
import { Eye, EyeOff, Pencil } from 'lucide-react-native';
import { FIGMA_COLORS } from './FigmaScreen';

type KeyboardType = 'default' | 'email-address' | 'number-pad' | 'url';

type TextFieldProps = {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardType;
    maxLength?: number;
    showPencil?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    accessibilityLabel?: string;
};

export default function TextField({
                                      label,
                                      value,
                                      onChangeText,
                                      placeholder,
                                      secureTextEntry = false,
                                      keyboardType = 'default',
                                      maxLength,
                                      showPencil = false,
                                      autoCapitalize,
                                      accessibilityLabel,
                                  }: TextFieldProps) {
    const [visible, setVisible] = useState(false);
    const inputRef = useRef<TextInputInstance | null>(null);

    const resolvedAutoCapitalize =
        autoCapitalize ?? (keyboardType === 'email-address' || keyboardType === 'url' ? 'none' : 'sentences');

    return (
        <View style={styles.wrap}>
            {label ? <Text style={styles.label}>{label}</Text> : null}
            <View style={styles.row}>
                <TextInput
                    ref={inputRef}
                    accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
                    autoCapitalize={resolvedAutoCapitalize}
                    autoCorrect={false}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={FIGMA_COLORS.muted}
                    returnKeyType="next"
                    secureTextEntry={secureTextEntry && !visible}
                    style={styles.input}
                    value={value}
                />
                {secureTextEntry ? (
                    <Pressable
                        accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        accessibilityRole="button"
                        onPress={() => setVisible(current => !current)}
                        style={styles.iconButton}
                    >
                        {visible ? (
                            <EyeOff color={FIGMA_COLORS.primary} size={18} />
                        ) : (
                            <Eye color={FIGMA_COLORS.primary} size={18} />
                        )}
                    </Pressable>
                ) : null}
                {showPencil ? (
                    <Pressable
                        accessibilityLabel={`Editar ${label ?? placeholder ?? 'campo'}`}
                        accessibilityRole="button"
                        onPress={() => inputRef.current?.focus()}
                        style={styles.iconButton}
                    >
                        <Pencil color={FIGMA_COLORS.primary} size={18} />
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        marginBottom: 14,
    },
    label: {
        color: FIGMA_COLORS.text,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    row: {
        alignItems: 'center',
        backgroundColor: FIGMA_COLORS.surface,
        borderColor: FIGMA_COLORS.border,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        minHeight: 50,
    },
    input: {
        color: FIGMA_COLORS.text,
        flex: 1,
        fontSize: 15,
        minHeight: 48,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        minWidth: 44,
    },
});