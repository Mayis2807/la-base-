
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class enviabbdd {
    public static void main(String[] args) {
        
        try {
            Connection con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/FeriaValencia", "Admin", "Admin");
            File f = new File("suscriptores.csv");
            FileReader fr = new FileReader(f);
            BufferedReader br = new BufferedReader(fr);
            String linea = br.readLine();
            int count = 0;

            while(linea != null){

                String [] datos = linea.split(",");
                String nombre = datos[0];
                String email = datos[1];
                String idioma = datos[2];
                int suscrito = Integer.parseInt(datos[3]);

                String sql = "INSERT INTO suscriptores (nombre, email, idioma, suscrito) VALUES (?,?,?,?)";
                PreparedStatement st = con.prepareStatement(sql);
                st.setString(1, nombre);
                st.setString(2, email);
                st.setString(3, idioma);
                st.setInt(4, suscrito);
                st.executeUpdate();
                count++;
                linea = br.readLine();
            }
            System.out.println("Se agregaron "+ count + " registros correctamente.");
        } catch (Exception e) {
            System.out.println("Excepción: "+e.toString());
        }
    }
}
