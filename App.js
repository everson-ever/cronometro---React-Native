import React from 'react';
import { AsyncStorage, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			buttonText: 'Iniciar',
			cronometroValue: 0,
			timesSaved: [],
			modalTimes: false
		};

		this.timer = null;
		this.borderColor = '#fff';
	}

	controlCronometro = () => {
		if (this.timer !== null) {
			let state = this.state;

			clearInterval(this.timer);
			state.buttonText = 'Iniciar';
			this.setState(state);
			this.timer = null;
			this.borderColor = '#fff';
		} else {
			this.timer = setInterval(() => {
				let state = this.state;

				let cronometroValue = this.state.cronometroValue;

				state.cronometroValue = cronometroValue + 0.1;
				state.buttonText = 'Parar';

				this.changeColor();

				this.setState(state);
			}, 100);
		}
	};

	restart = () => {
		if (this.timer !== null) {
			let state = this.state;

			clearInterval(this.timer);
			state.buttonText = 'Iniciar';
			this.setState(state);
			this.timer = null;
			this.borderColor = '#fff';
		}

		this.setState({ cronometroValue: 0 });
	};

	changeColor = () => {
		if (this.borderColor === '#fff') {
			this.borderColor = '#3252a8';
		} else {
			this.borderColor = '#fff';
		}
	};

	backgroundColorCronometro = () => {
		return {
			borderColor: this.borderColor
		};
	};

	saveTime = async () => {
		let timesSaved = (await AsyncStorage.getItem('times')) || '[]';

		let times = [];

		times = JSON.parse(timesSaved);

		if (times.length === 5) {
			times.pop();
		}

		times.unshift(this.state.cronometroValue.toFixed(1));
		times = JSON.stringify(times);
		AsyncStorage.setItem('times', times);
	};

	openTimes = async () => {
		let times = (await AsyncStorage.getItem('times')) || '[]';
		this.state.timesSaved = JSON.parse(times);

		this.setState({ modalTimes: true });
	};

	closeModal = () => {
		this.setState({ modalTimes: false });
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={[ styles.cronometro, this.backgroundColorCronometro() ]}>
					<Text style={styles.time}>{this.state.cronometroValue.toFixed(1)} s</Text>
				</View>
				<View style={styles.boxButton}>
					<TouchableOpacity onPress={this.controlCronometro} style={[ styles.button, styles.buttonStart ]}>
						<Text style={styles.buttonText}>{this.state.buttonText}</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.restart} style={[ styles.button, styles.buttonRestart ]}>
						<Text style={[ styles.buttonText, styles.buttonTextRestart ]}>Zerar</Text>
					</TouchableOpacity>
				</View>

				<View style={[ styles.boxButtonSave ]}>
					<TouchableOpacity onPress={this.saveTime} style={[ styles.buttonSave ]}>
						<Text style={[ styles.buttonText, styles.buttonTextSave ]}>Salvar Tempo</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.openTimes}>
						<Text style={styles.textOpenModal}>Tempos salvos</Text>
					</TouchableOpacity>
				</View>

				<Modal animationType="slide" visible={this.state.modalTimes}>
					<View style={styles.boxModal}>
						<TouchableOpacity onPress={this.closeModal} style={styles.boxCloseModal}>
							<Text style={styles.textCloseModal}>X</Text>
						</TouchableOpacity>

						<View style={styles.boxTimes}>
							{this.state.timesSaved.map((item, index) => {
								return (
									<Text style={styles.timeSave}>
										{index + 1}ª {item} s
									</Text>
								);
							})}
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#3252a8',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cronometro: {
		width: 250,
		height: 250,
		borderWidth: 1,
		borderColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 125
	},
	borderCronometro: {
		borderColor: '#fff'
	},
	time: {
		color: '#fff',
		fontSize: 60,
		fontWeight: '600'
	},
	boxButton: {
		flexDirection: 'row',
		paddingTop: 20
	},
	button: {
		width: 150,
		height: 50,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		textTransform: 'uppercase'
	},
	buttonTextRestart: {
		color: '#000'
	},
	buttonStart: {
		backgroundColor: '#002ea8'
	},
	buttonRestart: {
		backgroundColor: '#fff'
	},
	boxButtonSave: {
		paddingTop: 15
	},
	buttonSave: {
		borderRadius: 5,
		width: 200,
		height: 50,
		backgroundColor: '#2ce81e',
		alignItems: 'center',
		justifyContent: 'center'
	},
	textOpenModal: {
		color: '#fff',
		textAlign: 'center',
		marginTop: 15
	},
	boxModal: {
		flex: 1,
		padding: 10,
		backgroundColor: '#3252a8'
	},
	boxCloseModal: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	textCloseModal: {
		fontSize: 20,
		color: '#fff'
	},
	boxTimes: {
		paddingTop: 50
	},
	timeSave: {
		fontSize: 22,
		marginBottom: 25,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.1)',
		color: '#fff'
	}
});
