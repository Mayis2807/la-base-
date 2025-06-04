
import java.io.*;
import java.sql.*;

public class enviabbdd {
    public static void main(String[] args) {

        try {
            Connection con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/FeriaValencia", "Practicas", "Practicas");
            File f = new File("suscriptores.csv");
            FileReader fr = new FileReader(f);
            BufferedReader br = new BufferedReader(fr);
            String linea = br.readLine();
            int count = 0;

            br.readLine();

            while(linea != null){

                String [] datos = linea.split(" ");
                String nombre = datos[0];
  	            String apellido = datos[1];
	            String idioma = datos[2];
                String email = datos[3];
	            int edad = Integer.parseInt(datos[4]);

                PreparedStatement pregunta = con.prepareStatement("SELECT COUNT(*) FROM USUARIO WHERE Email = ?");
                pregunta.setString(1, email);
                ResultSet rs = pregunta.executeQuery();
                rs.next();
                int counti = rs.getInt(1);


                if (counti == 0){
                    String sql = "INSERT INTO USUARIO (Nombre, Apellido, Idioma, Email, Edad) VALUES (?,?,?,?,?)";
                    PreparedStatement st = con.prepareStatement(sql);
                    st.setString(1, nombre);
                    st.setString(2, apellido);
                    st.setString(3, idioma);
                    st.setString(4, email);
                    st.setInt(5, edad);
                    st.executeUpdate();
                    count++;
                }
                linea = br.readLine();
            }
            System.out.println("Se agregaron "+ count + " registros correctamente.");
        } catch (Exception e) {
            System.out.println("Excepción: "+e.toString());
        }
    }
}
